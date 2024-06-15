<template>
    <div class="carousel">
      <div class="carousel-inner">
        <div v-for="(image, index) in images" :key="index" class="carousel-item">
          <img :src="image.ImageUrl" alt="Camping spot image">
        </div>
      </div>
      <div class="carousel-controls">
        <button @click="prevImage">Previous</button>
        <button @click="nextImage">Next</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      images: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        currentIndex: 0
      }
    },
    methods: {
      prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
      },
      nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
      }
    }
  }
  </script>
  
  <style scoped>
  .carousel {
    position: relative;
    width: 100%;
    height: 200px;
    margin-bottom: 20px;
  }
  
  .carousel-inner {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .carousel-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
  }
  
  .carousel-item.active {
    display: block;
  }
  
  .carousel-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
  }
  
  .carousel-controls button {
    background-color: #fff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
  }
  
  .carousel-controls button:hover {
    background-color: #ddd;
  }
  </style>