<template>
  <div>
    <HeaderBar />
    <div class="registration-container">
      <div class="image-container">
        <img alt="Background Image" src="@/assets/Login.avif" class="background-image" />
      </div>
      <div class="form-container">
        <h1>Turn Your Property into a Campspot Paradise</h1>
        <form @submit.prevent="registerOwner" class="registration-form">
          <div class="form-group">
            <label for="firstName"></label>
            <input type="text" v-model="firstName" required placeholder="Enter your first name" />
          </div>
          <div class="form-group">
            <label for="lastName"></label>
            <input type="text" v-model="lastName" required placeholder="Enter your last name" />
          </div>
          <div class="form-group">
            <label for="email"></label>
            <input type="email" v-model="email" required placeholder="Enter your email" />
          </div>
          <div class="form-group">
            <label for="password"></label>
            <input type="password" v-model="password" required placeholder="Enter your password" />
          </div>
          <button type="submit" class="btn-submit">Register as Owner</button>
          <div v-if="error" class="error-message">{{ error }}</div>
          <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import HeaderBar from './HeaderBar.vue';

export default {
  name: 'OwnerRegister',
  components: {
    HeaderBar
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: null,
      successMessage: null
    };
  },
  methods: {
    async registerOwner() {
      // Create an object containing the new owner's information
      const owner = {
        email: this.email,
        password: this.password,
        first_Name: this.firstName,
        last_Name: this.lastName
      };

      try {
        // Send a POST request to register the new owner
        const response = await axios.post('http://localhost:5254/api/owner', owner);
        this.successMessage = 'Successfully registered as owner';

        // Store the owner ID in local storage
        localStorage.setItem('ownerId', response.data.ownerId);

        this.clearForm();
        this.$router.push({ name: 'OwnerPage' }); // Redirect to OwnerPage
      } catch (error) {
        if (error.response && error.response.data) {
          this.error = error.response.data;
        } else {
          this.error = 'An error occurred during registration. Please try again later.';
        }
      }
    },
    clearForm() {
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.password = '';
      this.error = null;
    }
  }
};
</script>



<style scoped>
.registration-container {
  display: flex;
  flex-direction: row; 
  height: 100vh; 
}

.image-container {
  flex: 2; 
}

.form-container {
  flex: 1; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9; 
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
}

.form-container h1 {
  margin-bottom: 20px;
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 20px;
  color: #5C6BC0;
}

.registration-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 15px;
}

.btn-submit {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  margin-top: 10px;
}
</style>
