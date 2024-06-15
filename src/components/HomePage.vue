<template>
  <div>
    <div :class="['background-container', { 'results-visible': resultsVisible }]"></div>
    <div class="homepage-container">
      <HeaderBar />
      <SearchBar @resultsVisible="handleResultsVisible" />
    </div>
  </div>
</template>

<script>
import HeaderBar from './HeaderBar.vue';
import SearchBar from './SearchBar.vue';



export default {
  name: 'HomePage',
  components: {
    HeaderBar,
    SearchBar
  },
  data() {
    return {
      resultsVisible: false
    };
  },
  // Handle blurring when images are displayed
  methods: {
    handleResultsVisible(isVisible) {
      this.resultsVisible = isVisible;
      if (isVisible) {
        document.addEventListener('click', this.handleClickOutside);
      } else {
        document.removeEventListener('click', this.handleClickOutside);
      }
    },
    handleClickOutside(event) {
      if (this.resultsVisible && !event.target.closest('.camping-spots-grid')) {
        this.resultsVisible = false;
      }
    }
  },
  beforeDestroy() {
    // Remove the event listener if the component is destroyed
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style>
.background-container {
  background-image: url('@/assets/Camp.avif');
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: filter 0.3s ease;
}

.background-container.results-visible {
  filter: blur(5px);
}

.homepage-container {
  position: relative;
  height: 100vh;
  overflow-y: auto;
}
</style>