<template>
    <div>
      <h2>{{ spot.spot_Name }}</h2>
      <p>Price per night: ${{ spot.price_Per_Night }}</p>
      <p>Location: {{ spot.city }}, {{ spot.state }}, {{ spot.zip_Code }}, {{ spot.country }}</p>
      <div v-if="spot.images && spot.images.length > 0">
        <div v-for="image in spot.images" :key="image.campingSpotImage_ID" class="image-container">
          <img :src="image.fullImageUrl" alt="Camping Spot Image">
        </div>
      </div>
      <p v-else>No images available</p>
      
      <!-- Booking form -->
      <label for="checkin">Check-In</label>
      <input type="date" id="checkin" v-model="checkinDate">
      <label for="checkout">Check-Out</label>
      <input type="date" id="checkout" v-model="checkoutDate">
      <button @click="bookSpot">Book</button>
      <p>Total Price: ${{ totalPrice }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SpotDetails',
    props: ['spot'],
    data() {
      return {
        checkinDate: '',
        checkoutDate: '',
        totalPrice: 0
      };
    },
    methods: {
      bookSpot() {
        // Calculate total price based on check-in and check-out dates and spot price per night
        // Create booking record using Axios or any other method
        // Update totalPrice
      }
    }
  };
  </script>
  
  <style scoped>
  /* Styles for SpotDetails component */
  </style>
  