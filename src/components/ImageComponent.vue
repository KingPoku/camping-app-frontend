<template>
  <div>
    <div class="image-container">
      <img src="http://localhost:5254/camp-images/Spot-2-1.jpg" alt="Static Camping Spot Image">
      <img src="http://localhost:5254/camp-images/Spot-2-2.jpg" alt="Static Camping Spot Image">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageComponent'
};
</script>

<style scoped>
.image-container {
  display: flex;
  /* Apply display: flex; to the parent container */
  overflow-x: auto;
  /* Enable horizontal scrolling */
}

.image-container img {
  height: 150px;
  width: auto;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-right: 10px;
  /* Add some space between images */
}
</style>