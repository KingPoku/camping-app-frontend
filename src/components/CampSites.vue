<template>
  <div>
    <HeaderBar />
    <div v-if="campsites.length > 0" class="campsites-container">
      <div v-for="campsite in campsites" :key="campsite.spotID" class="campsite">
        <div class="campsite__image">
          <Carousel :autoplay="carouselOptions.autoplay" :perPage="carouselOptions.perPage"
            :navigationEnabled="carouselOptions.navigationEnabled"
            :paginationEnabled="carouselOptions.paginationEnabled">
            <Slide v-for="(image, index) in campsite.images" :key="index">
              <img :src="image" alt="Campsite Image" class="campsite-image" />
            </Slide>
          </Carousel>
        </div>
        <div class="campsite-details">
          <h3>{{ campsite.spot_Name }}</h3>
          <p>{{ campsite.city }}, {{ campsite.state }} {{ campsite.zip_Code }}</p>
          <p>Price: ${{ campsite.price_Per_Night }}</p>
          <button @click="goToBookingPage(campsite.spotID)" class="book-button">Book</button>
        </div>
      </div>
    </div>
    <div v-else class="loading">Loading camping spots...</div>
  </div>
</template>


<script>
import HeaderBar from './HeaderBar.vue';
import { Carousel, Slide } from 'vue-carousel'; // Import Carousel and Slide components from vue-carousel

export default {
  name: 'CampSites',
  components: {
    HeaderBar,
    Carousel,
    Slide,
  },
  data() {
    return {
      campsites: [], // Array to hold the fetched campsites
      filteredCampsites: [], 
      carouselOptions: {
        autoplay: true,
        perPage: 1,
        navigationEnabled: true,
        paginationEnabled: false,
      },
    };
  },
  created() {
    this.fetchCampsites(); // Fetch campsites when the component is created
  },
  methods: {
    async fetchCampsites() {
      try {
        const response = await fetch('http://localhost:5254/api/CampingSpots'); // Fetch the list of campsites from the API
        if (!response.ok) {
          throw new Error('Failed to fetch campsites');
        }
        const campsites = await response.json(); // Parse the JSON response
        this.campsites = campsites.map(campsite => ({
          ...campsite,
          images: [], // Initialize the images array for each campsite
        }));
        await this.fetchCampingSpotImages(); // Fetch images for each campsite
        this.filteredCampsites = [...this.campsites]; // Copy fetched campsites to filteredCampsites
      } catch (error) {
        console.error('Error fetching campsites:', error); // Log any errors during the fetch
      }
    },
    async fetchCampingSpotImages() {
      try {
        for (const campsite of this.campsites) {
          if (!campsite.spotID) {
            console.error('SpotID is undefined for campsite:', campsite);  // Log an error if spotID is undefined
            continue; // Skip this campsite if spotID is missing
          }
          const response = await fetch(`http://localhost:5254/api/CampingSpotImage/spot/${campsite.spotID}`);
          if (!response.ok) {
            console.error(`Failed to fetch images for SpotID ${campsite.spotID}`);
            continue;
          }
          const images = await response.json();
          if (!Array.isArray(images)) {
            console.error('Images response is not an array:', images);
            continue;
          }
          campsite.images = images.map(image => `http://localhost:5254${image.imageUrl}`);
        }
      } catch (error) {
        console.error('Error fetching camping spot images:', error);
      }
    },
    goToBookingPage(spotID) {
      this.$router.push({ name: 'BookingPage', params: { spotID } });
    },
  },
};
</script>




<style scoped>
.campsites-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20px;
  padding: 20px;
}

.campsite {
  display: flex;
  flex-direction: column;
  margin: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  width: 300px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.campsite:hover {
  transform: scale(1.02);
}

.campsite__image {
  height: 200px;
  /* Adjust height to ensure images are not too large */
  overflow: hidden;
}

.campsite__image .carousel-wrapper {
  height: 100%;
  /* Ensure carousel fills the container */
}

.campsite-details {
  padding: 15px;
}

.campsite-details h3 {
  margin-top: 0;
  font-size: 1.25rem;
  color: #333;
}

.campsite-details p {
  margin: 5px 0;
  color: #555;
}

.campsite-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Book button */
.book-button {
  background-color: #007bff;
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
  background-color: #0056b3;
}

/* Carousel navigation buttons */
.carousel-wrapper .VueCarousel-navigation-button {
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.carousel-wrapper .VueCarousel-navigation-button--prev {
  left: 10px;
}

.carousel-wrapper .VueCarousel-navigation-button--next {
  right: 10px;
}
</style>
