<template>
  <div>
    <HeaderBar />

     <!-- Check if campsite object has any properties before rendering booking page -->
    <div v-if="Object.keys(campsite).length" class="booking-page">
      <div class="booking-details card">

        <!-- Display campsite details -->
        <div class="card-header">
          <h2>{{ campsite.spot_Name }}</h2>
          <p>{{ campsite.city }}, {{ campsite.state }} {{ campsite.zip_Code }}</p>
          <p>Price per night: ${{ campsite.price_Per_Night }}</p>
        </div>

         <!-- Display campsite images -->
        <div class="card-body">
          <div class="image-grid">
            <div v-for="(image, index) in campsite.images" :key="index" class="image-grid-item">
              <img :src="image" alt="Campsite Image" class="booking-image" />
            </div>
          </div>

            <!-- Display list of amenities -->
          <div class="amenities">
            <h3>Amenities</h3>
            <ul class="amenities-list">
              <li v-for="(amenity, index) in campsite.amenities" :key="index">
                <span class="amenity-icon">{{ getAmenityIcon(amenity) }}</span> {{ amenity }}
              </li>
            </ul>
          </div>
        </div>
      </div>

       <!-- Form for booking the campsite -->
      <div class="booking-form card">
        <div class="card-header">
          <h3>Book this campsite</h3>
        </div>
        <div class="card-body">
           <!-- Form to submit booking, with check-in and check-out dates -->
          <form @submit.prevent="submitBooking">
            <label for="checkInDate">Check-in Date:</label>
            <input type="date" v-model="checkInDate" required />
            <label for="checkOutDate">Check-out Date:</label>
            <input type="date" v-model="checkOutDate" required />
            <p>Total Price: ${{ totalPrice }}</p>
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <button type="submit" class="book-button">Book</button>
          </form>
        </div>
      </div>
    </div>
      <!-- Review section, moved outside of the .booking-page div -->
    <div v-if="Object.keys(campsite).length" class="review-container">
      <div class="review-section card">
        <div class="card-header">
          <h3>Reviews</h3>
        </div>
        <div class="card-body">
           <!-- Displaying existing reviews -->
          <div v-if="reviews.length">
            <div v-for="(review, index) in reviews" :key="index" class="review-item">
              <p>{{ review.reviewText }}</p>
            </div>
          </div>
          <div v-else>
            <p>No reviews yet. Be the first to leave a review!</p>
          </div>
            <!-- Form to submit a new review -->
          <form @submit.prevent="submitReview">
            <label for="newReview">Add a Review:</label>
            <textarea v-model="newReview" id="newReview" rows="4" required></textarea>
            <div v-if="reviewError" class="alert alert-danger">{{ reviewError }}</div>
            <button type="submit" class="submit-review-button">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
     <!-- Map showing the location of the campsite -->
    <div v-if="Object.keys(campsite).length" class="map-container">
      <div class="map-heading">
        <h3>Here is where you will be</h3>
      </div>

       <!-- Leaflet map with the campsite's coordinates -->
      <l-map :zoom="zoomLevel" :center="mapCenter" style="height: 400px; width: 100%;">
        <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'"></l-tile-layer>
        <l-marker :lat-lng="mapCenter"></l-marker>
      </l-map>
    </div>
    <!-- Alert message, displayed if alertMessage is set -->
    <div v-if="alertMessage" :class="['alert', alertType]">{{ alertMessage }}</div>
  </div>
</template>


<script>
// Import necessary components and libraries
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import authMixin from '@/mixins/auth';
import axios from 'axios';
import HeaderBar from './HeaderBar.vue';

// Set default icons for Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: 'BookingPage',
  components: {
    HeaderBar,
    LMap,
    LTileLayer,
    LMarker
  },
  mixins: [authMixin],
  data() {
    return {
      campsite: {},
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
        const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);  // Calculate number of nights
        return (nights * this.campsite.price_Per_Night).toFixed(2);
      }
      return 0;
    },
    // Check if check-in date is valid (not in the past)
    isCheckInDateValid() {
      const today = new Date().setHours(0, 0, 0, 0);
      const checkIn = new Date(this.checkInDate).setHours(0, 0, 0, 0);
      return checkIn >= today;
    },

      // Check if check-out date is valid (after check-in date)
    isCheckOutDateValid() {
      if (!this.checkInDate || !this.checkOutDate) return true;
      const checkIn = new Date(this.checkInDate);
      const checkOut = new Date(this.checkOutDate);
      return checkOut > checkIn;
    },
  },
  methods: {
     // Fetch campsite details from the API
    async fetchCampsite() {
      try {
        const spotID = this.$route.params.spotID; // Get spot ID from route parameters
        const response = await axios.get(`http://localhost:5254/api/CampingSpots/${spotID}`);
        const campsite = response.data;

         // Fetch campsite images
        const imageResponse = await axios.get(`http://localhost:5254/api/CampingSpotImage/spot/${spotID}`);
        const images = imageResponse.data;

         // Set fetched campsite details
        this.campsite = campsite;
        this.campsite.images = images.map((image) => `http://localhost:5254${image.imageUrl}`);

        // Fetch coordinates using OpenCage API
        this.getCoordinates(campsite);
      } catch (error) {
        console.error('Error fetching campsite:', error);
      }
    },
     // Fetch coordinates for the given campsite address
    async getCoordinates(campsite) {
      try {
        const address = `${campsite.city}, ${campsite.state}, ${campsite.zip_Code}, ${campsite.country}`;
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
          params: {
            q: address,
            key: this.apiKey
          }
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

      // check the dates selected by user
      if (!this.validateDates()) {
        this.displayAlert('Invalid dates', 'alert-danger');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5254/api/availability/check', {
          params: {
            spotID: this.campsite.spotID,
            checkInDate: this.checkInDate,
            checkOutDate: this.checkOutDate
          }
        });

        if (!response.data.available) {
          this.displayAlert('The selected spot is not available for the chosen dates.', 'alert-warning');
          return;
        }

        const currentUser = this.currentUser;
        if (!currentUser || !currentUser.id) {
          this.$router.push({ name: 'LoginPage' });
          return;
        }

        const cleanedTotalPrice = this.totalPrice.replace('$', '');

        const booking = {
          userID: currentUser.id,
          spotID: this.campsite.spotID,
          check_In_Date: new Date(this.checkInDate).toISOString(),
          check_Out_Date: new Date(this.checkOutDate).toISOString(),
          total_Price: parseFloat(cleanedTotalPrice)
        };

        await axios.post('http://localhost:5254/api/Bookings', booking);

        this.displayAlert('Booking successful!', 'alert-success');
        setTimeout(() => {
          this.$router.push('/');
        }, 1000);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.displayAlert('The selected spot is not available for the chosen dates.', 'alert-warning');
        } else {
          console.error('Error during booking:', error);
          this.displayAlert('Failed to create booking', 'alert-danger');
        }
      }
    },
    async fetchReviews() {
      try {
        const response = await axios.get(`http://localhost:5254/api/reviews/${this.$route.params.spotID}`);
        this.reviews = response.data;
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    },
    async submitReview() {
      if (!this.newReview.trim()) {
        this.reviewError = 'Review cannot be empty';
        return;
      }

      try {
        const currentUser = this.currentUser;
        if (!currentUser || !currentUser.id) {
          this.$router.push({ name: 'LoginPage' });
          return;
        }

        const review = {
          userID: currentUser.id,
          spotID: this.campsite.spotID,
          reviewText: this.newReview.trim()
        };

        await axios.post('http://localhost:5254/api/reviews', review);
        this.reviews.push(review);
        this.newReview = '';
        this.reviewError = '';
      } catch (error) {
        console.error('Error submitting review:', error);
        this.reviewError = 'Failed to submit review';
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
    getAmenityIcon(amenity) {
      const icons = {
        Wifi: '📶',
        Cooker: '🍳',
        Shower: '🚿',
        Restrooms: '🚻',
        ElectricHookup: '🔌',
        CarPark: '🚗',
        BBQ: '🍖',
        WasteManagement: '🗑️',
        Pool: '🏊',
        Laundry: '🧺',
        RecreationFacilities: '🏀',
        PetFriendly: '🐾',
        DrinkingWater: '🚰',
        PicnicTable: '🍽️'
      };
      return icons[amenity] || '🌟';
    }
  },
  created() {
    this.fetchCampsite();
    this.fetchReviews();
  },
  watch: {
    '$route.params.spotID': function () {
      this.fetchCampsite();
      this.fetchReviews(); // Fetch reviews when spotID changes
    }
  }
};
</script>

<style scoped>
.booking-page {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 20px;
  background-color: #f7f7f7;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.booking-details {
  flex: 2;
  margin-right: 20px;
}

.booking-form {
  flex: 1;
  align-self: flex-start;
  position: sticky;
  top: 20px;
}

.card-header {
  background-color: #2E8B57;
  /* Green to fit theme */
  color: #fff;
  padding: 15px;
  text-align: center;
}

.card-body {
  padding: 20px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  /* Larger images */
  gap: 10px;
}

.image-grid-item {
  overflow: hidden;
  border-radius: 8px;
}

.booking-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.amenities-list {
  list-style: none;
  padding: 0;
}

.amenities-list li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.amenity-icon {
  font-size: 20px;
  margin-right: 10px;
}

.book-button {
  background-color: #2E8B57;
  /* Green to fit theme */
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.book-button:hover {
  background-color: #218838;
}

.alert {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 20px;
  border-radius: 4px;
  font-size: 1rem;
  z-index: 1000;
}

.alert-success {
  background-color: #28a745;
  color: #fff;
}

.alert-danger {
  background-color: #dc3545;
  color: #fff;
}

.alert-warning {
  background-color: #ffc107;
  color: #000;
}

.review-section {
  width: 80%;
  /* Set width to 80% of the container */
  max-width: 800px;
  /* Optional: Set a maximum width */
  margin: 0 auto;
  /* Center horizontally */
  box-sizing: border-box;
}

.review-container {
  display: flex;
  justify-content: left;
  /* Center the review section */
  padding: 20px;
  background-color: #f7f7f7;
  /* Optional: Background color similar to the main section */
}

.review-item {
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.submit-review-button {
  background-color: #2E8B57;
  /* Green to fit theme */
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.submit-review-button:hover {
  background-color: #218838;
}

.map-container {
  width: 80%;
  max-width: 800px;
  margin: 20px auto;
  /* Center the map */
  box-sizing: border-box;
}

.map-container h3 {
  text-align: center;
  margin-bottom: 10px;
}

.map-heading {
  text-align: center;
  /* Center the text horizontally */
  margin-bottom: 20px;
  /* Add some spacing below the heading */
}

.map-heading h3 {
  font-size: 24px;
  /* Increase the font size */
  color: #353935;
  /* Green color to match the theme */
}
</style>
