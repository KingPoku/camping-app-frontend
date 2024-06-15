<template>
  <div class="signup-container">
    <div class="image-container">
      <img alt="Background Image" src="@/assets/Login.avif" class="background-image" />
    </div>
    <div class="form-container">
      <img alt="Camp Logo" src="../assets/Camp_Logo.avif" class="logo" />
      <h1>Camp Like a Pro</h1>
      <form class="signup-form">
        <div class="form-group">
          <label for="firstName"></label>
          <input type="text" v-model="firstname" id="firstName" placeholder="Enter your first name" />
        </div>
        <div class="form-group">
          <label for="lastName"></label>
          <input type="text" v-model="lastname" id="lastName" placeholder="Enter your last name" />
        </div>
        <div class="form-group">
          <label for="email"></label>
          <input type="email" v-model="email" id="email" placeholder="Enter your email" />
        </div>
        <div class="form-group">
          <label for="password"></label>
          <input type="password" v-model="password" id="password" placeholder="Enter your password" />
        </div>
        <button type="button" v-on:click="signUp">Sign Up</button>
        <div class="login-link">
          <router-link to="/login" class="login-text">Already have an account? Login here</router-link>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'SignUpForm',
  data() {
    return {
      firstname: '',
      lastname: '',
      email: '',
      password: ''
    };
  },
  methods: {
    async signUp() {
      try {
         // Check if the user already exists
        const userExistsResponse = await axios.get(`http://localhost:5254/api/Users/api/checkUser?email=${this.email}`);

        if (userExistsResponse.data.exists) {
           // If user exists, redirect to HomePage
          console.log("User already exists, redirecting to HomePage...");
          this.$router.push({ name: 'HomePage' });
          return;
        }

         // Proceed with user sign-up if the user doesn't exist
        const response = await axios.post("http://localhost:5254/api/Users", {
          first_Name: this.firstname,
          last_Name: this.lastname,
          email: this.email,
          password: this.password
        });

        console.log("User signed up successfully:", response.data);

        // Save user information in local storage
        localStorage.setItem('user-info', JSON.stringify(response.data));


        this.firstname = '';
        this.lastname = '';
        this.email = '';
        this.password = '';

        // Redirect to HomePage after successful sign-up
        this.$router.push({ name: 'HomePage' });
      } catch (error) {
        console.error("Error signing up:", error);
      }
    }
  },

  mounted() {
     // Check if user is already signed in
    let user = localStorage.getItem('user-info');
    if (user) {
      console.log("User already signed in, redirecting to HomePage...");
      this.$router.push({ name: 'HomePage' }); // Redirect to HomePage if user info is found
    }
  }
};

</script>

<style>
.signup-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  
}

.image-container {
  flex: 2;
  
}

.logo {
  width: 150px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid skyblue !important;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #218838;
}

.login-link {
  margin-top: 20px; 
  text-align: center;
}

.login-text {
  color: #007bff; 
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.login-text:hover {
  color: #0056b3; 
}
</style>
