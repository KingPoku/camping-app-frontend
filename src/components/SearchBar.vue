<template>
  <div>
    <div class="search-bar">
      <div class="search-field">
        <input type="text" id="amenities" v-model="amenities" placeholder="Find your perfect camp.....">
      </div>
      <button class="search-button" @click="search">Search</button>
    </div>

    <div class="camping-spots">
      <div v-if="campingSpots.length === 0"></div>
      <div v-else class="camping-spots-grid">
        <div v-for="spot in campingSpots" :key="spot.spotID" class="camping-spot">
          <div class="campsite__image">
            <Carousel :autoplay="carouselOptions.autoplay" :perPage="carouselOptions.perPage"
              :navigationEnabled="carouselOptions.navigationEnabled"
              :paginationEnabled="carouselOptions.paginationEnabled">
              <Slide v-for="(image, index) in spot.images" :key="index">
                <img :src="image.fullImageUrl" alt="Camping Spot Image" class="campsite-image" />
              </Slide>
            </Carousel>
          </div>
          <div class="campsite-details">
            <h3>{{ spot.spot_Name }}</h3>
            <p>{{ spot.city }}, {{ spot.state }} {{ spot.zip_Code }}</p>
            <p>Price per night: ${{ spot.price_Per_Night }}</p>
            <button @click="viewSpotDetails(spot)" class="book-button">Book</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { Carousel, Slide } from 'vue-carousel'; // Import carousel components from vue-carousel

export default {
  name: 'SearchBar',
  components: {
    Carousel,  // Register Carousel component
    Slide, // Register Slide component
  },
  data() {
    return {
      amenities: '', // String to hold selected amenities for search
      campingSpots: [], // Array to store the camping spots returned from the search
      carouselOptions: {
        autoplay: true, // Enable automatic slide transition
        perPage: 1,  // Display one slide per page
        navigationEnabled: true,
        paginationEnabled: false,
      },
    };
  },
  methods: {
    async search() {
      try {
        // Make a GET request to fetch camping spots filtered by selected amenities
        const response = await axios.get('http://localhost:5254/api/CampingSpots/filter', {
          params: {
            amenities: this.amenities // Pass selected amenities as query parameter
          },
        });

         // Fetch images for each camping spot returned in the response
        const spotsWithImages = await Promise.all(response.data.map(async (spot) => {
          try {
            const imageResponse = await axios.get(`http://localhost:5254/api/CampingSpotImage/spot/${spot.spotID}`);
            if (imageResponse.data && imageResponse.data.length > 0) {
              // Append full image URLs to the spot's images if available
              spot.images = imageResponse.data.map(image => ({
                ...image,
                fullImageUrl: `http://localhost:5254${image.imageUrl}`,
              }));
            } else {
              spot.images = []; // Initialize with empty array if no images are found
            }
          } catch (error) {
            spot.images = []; // Handle error by setting images to an empty array
          }
          return spot; // Return the updated spot with images
        }));

        this.campingSpots = spotsWithImages;   // Update component state with spots and their images
        this.$emit('resultsVisible', spotsWithImages.length > 0); // Emit event to indicate search results visibility
      } catch (error) {
        console.error('Error during search:', error);
        this.$emit('resultsVisible', false); // Emit event to hide search results in case of error
      }
    },
    viewSpotDetails(spot) {
       // Navigate to the BookNow page with the selected spot details as route params
      this.$router.push({ name: 'BookNow', params: { selectedSpot: spot } });
    },
  },
};
</script>

<style scoped>
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  max-width: 80%;
  margin: 20px auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.search-field {
  flex-grow: 1;
  margin-right: 10px;
}



.search-field input {
  width: 80%;
  padding: 12px 20px;
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 16px;
  color: #333;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-field input:focus {
  outline: none;
  border-color: #66afe9;
  box-shadow: 0 0 8px rgba(102, 175, 233, 0.6);
}

.search-button {
  padding: 12px 20px;
  background-color: #007bff;
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s;
  width: 20%;
}

.search-button:hover {
  background-color: #45a049;
}

.search-button:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(72, 207, 85, 0.7);
}

.camping-spots {
  margin: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.camping-spots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.camping-spot {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.camping-spot:hover {
  transform: scale(1.02);
}

.campsite__image {
  height: 200px;
  overflow: hidden;
}

.campsite__image .carousel-wrapper {
  height: 100%;
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
