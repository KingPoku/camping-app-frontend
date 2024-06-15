<template>
  <div>
    <HeaderBar />
    <div class="owner-page">
      <h1>Manage Your Camping Spots</h1>
      <button @click="showCreateForm = true" class="create-button">Create New Camping Spot</button>

      <div class="main-container">
        <div v-if="showCreateForm" class="create-form">
          <h2>Create a New Camping Spot</h2>
          <form @submit.prevent="createCampingSpot">
            <div class="form-group">
              <label for="spotName">Spot Name:</label>
              <input type="text" v-model="newSpot.spotName" id="spotName" required />
            </div>
            <div class="form-group">
              <label for="pricePerNight">Price Per Night:</label>
              <input type="number" v-model="newSpot.pricePerNight" id="pricePerNight" required />
            </div>
            <div class="form-group">
              <label for="city">City:</label>
              <input type="text" v-model="newSpot.city" id="city" />
            </div>
            <div class="form-group">
              <label for="state">State:</label>
              <input type="text" v-model="newSpot.state" id="state" />
            </div>
            <div class="form-group">
              <label for="zipCode">Zip Code:</label>
              <input type="text" v-model="newSpot.zipCode" id="zipCode" />
            </div>
            <div class="form-group">
              <label for="country">Country:</label>
              <input type="text" v-model="newSpot.country" id="country" />
            </div>
            <div class="form-group">
              <label for="amenities">Amenities:</label>
              <input type="text" v-model="newSpot.amenities" id="amenities" placeholder="e.g., Wifi, Pool, BBQ" />
            </div>
            <div class="form-group">
              <label for="imageFiles">Select Images:</label>
              <input type="file" id="imageFiles" @change="onFileChange" multiple required />
            </div>
            <div class="form-group">
              <ul>
                <li v-for="(file, index) in newSpot.imageFiles" :key="index">{{ file.name }}</li>
              </ul>
            </div>
            <div class="form-actions">
              <button type="submit" class="submit-button">Create Spot</button>
              <button @click="showCreateForm = false" class="cancel-button">Cancel</button>
            </div>
          </form>
        </div>

        <div class="spots-list">
          <h2>Your Camping Spots</h2>
          <div v-if="campingSpots.length === 0" class="no-spots">You have no camping spots yet.</div>
          <div v-else>
            <div v-for="spot in campingSpots" :key="spot.spotID" class="spot-item">
              <div class="spot-details">
                <h3>{{ spot.spot_Name }} - ${{ spot.price_Per_Night }} per night</h3>
                <h4>{{ spot.city }}, {{ spot.country }}</h4>
                <p>Amenities: <span class="amenities">{{ spot.amenities.join(', ') }}</span></p>
              </div>
              <div v-if="spot.isBooked" class="booking-details">
                <p><strong>Booked:</strong> Yes</p>
                <p><strong>Check-In:</strong> {{ new Date(spot.check_In_Date).toLocaleDateString() }}</p>
                <p><strong>Check-Out:</strong> {{ new Date(spot.check_Out_Date).toLocaleDateString() }}</p>
              </div>
              <div v-else class="availability-details">
                <p><strong>Booked:</strong> No</p>
              </div>
              <button :class="spot.isBooked ? 'available-button' : 'booked-button'"
                @click="toggleBookingStatus(spot.SpotID)">
                {{ spot.isBooked ? 'Make Available' : 'Make Unavailble' }}
              </button>
              <div v-if="successMessage" class="success-message">
                {{ successMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderBar from './HeaderBar.vue';
import axios from 'axios';

export default {
  name: 'OwnerPage',
  components: {
    HeaderBar,
  },
  data() {
    return {
      showCreateForm: false, // Boolean to toggle the visibility of the camping spot creation form
      newSpot: {// Object to store new camping spot details
        spotName: '',
        pricePerNight: 0,
        city: '',
        state: '',
        zipCode: '',
        country: '',
        amenities: '',
      },
      campingSpots: [], // Array to hold existing camping spots
      imageFiles: [], // Array to hold uploaded image files
      successMessage: '',
    };
  },
  methods: {
    async createCampingSpot() {
      const formData = new FormData(); // Create a new FormData object for multipart/form-data submission
      formData.append('Spot_Name', this.newSpot.spotName);
      formData.append('Price_Per_Night', this.newSpot.pricePerNight);
      formData.append('City', this.newSpot.city);
      formData.append('State', this.newSpot.state);
      formData.append('Zip_Code', this.newSpot.zipCode);
      formData.append('Country', this.newSpot.country);

      // Split amenities by comma and trim whitespace
      const amenitiesArray = this.newSpot.amenities.split(',').map(a => a.trim());
      amenitiesArray.forEach((amenity, index) => {
        formData.append(`Amenities[${index}]`, amenity);
      });

      // Retrieve ownerId from localStorage
      const ownerId = localStorage.getItem('ownerId');
      if (!ownerId) {
        console.error('Owner ID not found in localStorage');
        return;
      }

      formData.append('OwnerId', ownerId);  // Attach the owner ID to the form data

      this.imageFiles.forEach(file => {
        formData.append('ImageUrls', file); // Attach each selected image file to the form data
      });

      try {
          // Send a POST request to create a new camping spot
        const response = await axios.post('http://localhost:5254/api/CampingSpotComposite', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',  // Set content type for file uploads
          },
        });

        this.successMessage = 'Camping spot created successfully'; // Update success message
        setTimeout(() => {
          this.successMessage = ''; // Clear success message after 3 seconds
        }, 3000);

        
        this.campingSpots.push(response.data); // Add the new spot to the list
        this.showCreateForm = false; // Hide the form
        this.resetNewSpot(); // Reset the form data
      } catch (error) {
        console.error('There was an error creating the camping spot!', error);
        alert('Error creating camping spot');
      }
    },
    resetNewSpot() {
      // Reset form fields to their initial values
      this.newSpot = {
        spotName: '',
        pricePerNight: 0,
        city: '',
        state: '',
        zipCode: '',
        country: '',
        amenities: '',
      };
      this.imageFiles = [];
    },
    onFileChange(event) {
      this.imageFiles = Array.from(event.target.files); // Convert file input to an array of files
    },
    async fetchCampingSpotsByOwner(ownerId) {
      try {
         // Fetch camping spots created by the owner
        const response = await axios.get(`http://localhost:5254/api/CampingSpots/owner/${ownerId}`);
        this.campingSpots = response.data; // Store the fetched spots in the component's state

      } catch (error) {
        console.error('There was an error fetching the camping spots!', error);
      }
    },
    async toggleBookingStatus(availabilityID) {
      try {
         // Toggle booking status for a specific availability
        await axios.put(`http://localhost:5254/api/availability/toggle/${availabilityID}`);
        this.fetchCampingSpotsByOwner(localStorage.getItem('ownerId')); // Refresh the camping spots list
      } catch (error) {
        console.error('Error toggling booking status:', error);
      }
    },
  },
  mounted() {
    // Retrieve and parse userInfo from localStorage
    const userInfoString = localStorage.getItem('user-info');

    // Check if userInfo is not null before parsing
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);

        // Check if the parsed object has an id property
        if (userInfo && userInfo.id) {
          const ownerId = userInfo.id;
          this.fetchCampingSpotsByOwner(ownerId);
        } else {
          console.error('Owner ID not found in user-info object');
        }
      } catch (error) {
        console.error('Error parsing user-info from localStorage', error);
      }
    } else {
      console.error('user-info not found in localStorage');
    }
  }
};
</script>

<style scoped>
.owner-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

h1,
h2 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.create-button {
  display: block;
  padding: 10px 20px;
  margin: 20px auto;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-button:hover {
  background-color: #0056b3;
}

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.create-form,
.spots-list {
  width: 100%;
  max-width: 800px;
  margin: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-button,
.cancel-button {
  padding: 10px 15px;
  margin: 5px;
  font-size: 14px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #dc3545;
}

.cancel-button:hover {
  background-color: #c82333;
}

.no-spots {
  font-size: 18px;
  color: #777;
  text-align: center;
  margin-top: 20px;
}

.spots-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.spot-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.spot-item:hover {
  transform: translateY(-5px);
}

.spot-details {
  margin-bottom: 10px;
}

.spot-details h3 {
  margin: 0 0 10px 0;
  color: #007bff;
}

.spot-details h4 {
  margin: 0 0 10px 0;
  color: #555;
}

.amenities {
  color: #007bff;
}

.success-message {
  color: green;
  font-size: 1.2em;
  margin-top: 10px;
}

.booking-details {
  margin-top: 10px;
  background-color: #ffe6e6;
  padding: 5px;
  border-radius: 4px;
}

.booked-button {
  background-color: red;
  color: white;
}

.available-button {
  background-color: green;
  color: white;
}
</style>