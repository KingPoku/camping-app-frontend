<template>
  <div>
    <HeaderBar />
    <div v-if="selectedSpot" class="booking-page">
      <div class="left-column">
        <div class="booking-details card">
          <div class="card-header">
            <h2>{{ selectedSpot.spot_Name }}</h2>
            <p>{{ selectedSpot.city }}, {{ selectedSpot.state }} {{ selectedSpot.zip_Code }}</p>
            <p>Price per night: ${{ selectedSpot.price_Per_Night }}</p>
          </div>
          <div class="card-body">
            <div class="image-grid">
              <div v-for="(image, index) in selectedSpot.images" :key="index" class="image-grid-item">
                <img :src="image.fullImageUrl" alt="Camping Spot Image" class="booking-image" />
              </div>
            </div>
            <div class="amenities">
              <h3>Amenities</h3>
              <ul class="amenities-list">
                <li v-for="(amenity, index) in selectedSpot.amenities" :key="index">
                  <span class="amenity-icon">{{ getAmenityIcon(amenity) }}</span> {{ amenity }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="review-container card">
          <div class="card-header">
            <h3>Reviews</h3>
          </div>
          <div class="card-body">
            <div v-if="reviews.length">
              <div v-for="(review, index) in reviews" :key="index" class="review-item">
                <p>{{ review.reviewText }}</p>
              </div>
            </div>
            <div v-else>
              <p>No reviews yet. Be the first to leave a review!</p>
            </div>
            <form @submit.prevent="submitReview">
              <label for="newReview">Add a Review:</label>
              <textarea v-model="newReview" id="newReview" rows="4" required></textarea>
              <div v-if="reviewError" class="alert alert-danger">{{ reviewError }}</div>
              <button type="submit" class="submit-review-button">Submit Review</button>
            </form>
          </div>
        </div>
      </div>
      <div class="right-column">
        <div class="booking-form card">
          <div class="card-header">
            <h3>Book this spot</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitBooking">
              <label for="checkin">Check-In</label>
              <input type="date" id="checkin" v-model="checkInDate" required>
              <label for="checkout">Check-Out</label>
              <input type="date" id="checkout" v-model="checkOutDate" required>
              <p class="total-price">Total Price: ${{ totalPrice }}</p>
              <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
              <button class="book-button" type="submit">Book Now</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedSpot" class="map-container card">
      <div class="card-header map-heading">
        <h3>Here is where you will be</h3>
      </div>
      <div class="card-body">
        <l-map :zoom="zoomLevel" :center="mapCenter" style="height: 400px; width: 100%;">
          <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'"></l-tile-layer>
          <l-marker :lat-lng="mapCenter"></l-marker>
        </l-map>
      </div>
    </div>
    <div v-if="alertMessage" :class="['alert', alertType]">{{ alertMessage }}</div>
  </div>
</template>


<script>
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import HeaderBar from './HeaderBar.vue';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: 'BookNow',
  components: {
    HeaderBar,
    LMap,
    LTileLayer,
    LMarker,
  },
  props: {
    selectedSpot: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      checkInDate: '',
      checkOutDate: '',
      errorMessage: '',
      alertMessage: '',
      alertType: '',
      reviews: [],
      newReview: '',
      reviewError: '',
      mapCenter: [51.505, -0.09],
      zoomLevel: 13,
      apiKey: '9a8cf0a00c6042d99eccd2469df03052',
    };
  },
  computed: {
    // Calculate total price based on check-in and check-out dates
    totalPrice() {
      if (this.checkInDate && this.checkOutDate) {
        const checkIn = new Date(this.checkInDate);
        const checkOut = new Date(this.checkOutDate);
        const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
        return (nights * this.selectedSpot.price_Per_Night).toFixed(2);
      }
      return 0;
    },
  },
  watch: {
    selectedSpot(newSpot) {
      if (newSpot) {
        this.getCoordinates(newSpot);
        this.fetchReviews(newSpot.spotID);
      }
    },
  },
  mounted() {
    if (this.selectedSpot) {
      this.getCoordinates(this.selectedSpot);
      this.fetchReviews(this.selectedSpot.spotID);
    }
  },
  methods: {
    async getCoordinates(spot) {
      try {
        const address = `${spot.city}, ${spot.state}, ${spot.zip_Code}, ${spot.country}`;
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
          params: {
            q: address,
            key: this.apiKey,
          },
        });
        const data = response.data;
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry;
          this.mapCenter = [lat, lng];
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    },
    async fetchReviews(spotID) {
      try {
        const response = await axios.get(`http://localhost:5254/api/reviews/${spotID}`);
        this.reviews = response.data;
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    },
    validateDates() {
      const checkInDate = new Date(this.checkInDate).setHours(0, 0, 0, 0);
      const checkOutDate = new Date(this.checkOutDate).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        this.errorMessage = 'Check-in date cannot be in the past. Please select a valid date.';
        return false;
      }
      if (checkOutDate <= checkInDate) {
        this.errorMessage = 'Check-out date must be after the check-in date. Please select a valid date.';
        return false;
      }
      this.errorMessage = '';
      return true;
    },
    async submitBooking() {

      // Check if the user is an owner
      const userRole = localStorage.getItem('user-role');
      if (userRole === 'Owner') {
        this.displayAlert('Please log in as a regular user to book this place.', 'alert-danger');
        this.$router.push({ name: 'LoginPage' });
        return;
      }

      if (!this.validateDates()) {
        this.displayAlert('Invalid dates', 'alert-danger');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5254/api/availability/check', {
          params: {
            spotID: this.selectedSpot.spotID,
            checkInDate: this.checkInDate,
            checkOutDate: this.checkOutDate,
          },
        });

        if (!response.data.available) {
          this.displayAlert('The selected spot is not available for the chosen dates.', 'alert-warning');
          return;
        }

        const currentUser = this.currentUser;
        if (!currentUser || !currentUser.id) {
          this.$router.push({ name: 'Login' });
          return;
        }

        const cleanedTotalPrice = parseFloat(this.totalPrice);

        const booking = {
          userID: currentUser.id,
          spotID: this.selectedSpot.spotID,
          check_In_Date: new Date(this.checkInDate).toISOString(),
          check_Out_Date: new Date(this.checkOutDate).toISOString(),
          total_Price: cleanedTotalPrice,
        };

        await axios.post('http://localhost:5254/api/Bookings', booking);

        this.displayAlert('Booking successful!', 'alert-success');
        this.$router.push('/');
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.displayAlert('The selected spot is not available for the chosen dates.', 'alert-warning');
        } else {
          this.displayAlert('Error submitting the booking. Please try again.', 'alert-danger');
        }
        console.error('Error submitting booking:', error);
      }
    },
    displayAlert(message, type) {
      this.alertMessage = message;
      this.alertType = type;
      setTimeout(() => {
        this.alertMessage = '';
        this.alertType = '';
      }, 5000);
    },
    async submitReview() {
      if (!this.newReview.trim()) {
        this.reviewError = 'Review cannot be empty.';
        return;
      }

      try {
        const currentUser = this.currentUser;
        if (!currentUser || !currentUser.id) {
          this.$router.push({ name: 'Login' });
          return;
        }

        const reviewData = {
          userID: currentUser.id,
          spotID: this.selectedSpot.spotID,
          reviewText: this.newReview.trim(),
        };

        await axios.post('http://localhost:5254/api/reviews', reviewData);

        this.reviews.push({
          userID: currentUser.id,
          reviewText: this.newReview.trim(),
        });

        this.newReview = '';
        this.reviewError = '';
        this.displayAlert('Review submitted successfully!', 'alert-success');
      } catch (error) {
        console.error('Error submitting review:', error);
        this.reviewError = 'Error submitting review. Please try again.';
      }
    },
    getAmenityIcon(amenity) {
      const icons = {
        Wifi: '📶',
        Parking: '🚗',
        PetFriendly: '🐾',
        Pool: '🏊‍♂️',
        Breakfast: '🍳',
        BBQ: '🍖',
        WasteManagement: '🗑️',
        Laundry: '🧺',
        RecreationFacilities: '🏀',
        DrinkingWater: '🚰',
        PicnicTable: '🍽️'
      };
      return icons[amenity] || '✔️';
    },
  },
};
</script>

<style scoped>
.booking-page {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.left-column {
  flex: 1 1 60%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-column {
  flex: 1 1 35%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 16px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #eee;
  font-size: 1.2rem;
  font-weight: bold;
}

.card-body {
  padding: 16px;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-grid-item {
  flex: 1 1 calc(33.333% - 10px);
}

.booking-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.booking-image:hover {
  transform: scale(1.05);
}

.amenities {
  margin-top: 20px;
}

.amenities-list {
  list-style: none;
  padding: 0;
}

.amenities-list li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1rem;
}

.amenity-icon {
  margin-right: 10px;
  color: #4CAF50;
  font-size: 1.5rem;
}

.total-price {
  font-weight: bold;
  margin-top: 10px;
  font-size: 1.2rem;
}

.error {
  color: red;
  margin-top: 10px;
}

.book-button,
.submit-review-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.book-button:hover,
.submit-review-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.review-item {
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.review-container {
  margin-top: 20px;
}

.map-container {
  margin-top: 20px;
}

.alert {
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  font-size: 1rem;
}

.alert-success {
  background-color: #4CAF50;
  color: white;
}

.alert-danger {
  background-color: #f44336;
  color: white;
}

.alert-warning {
  background-color: #ff9800;
  color: white;
}
</style>