<template>
  <div>
    <HeaderBar />
    <div class="login-container">
      <div class="image-container">
        <img alt="Background Image" src="@/assets/Login.avif" class="background-image" />
      </div>
      <div class="form-container">
        <h1>Login</h1>
        <div class="form-group">
          <label for="email"></label>
          <input type="email" v-model="email" id="email" placeholder="Enter your email" />
        </div>
        <div class="form-group">
          <label for="password"></label>
          <input type="password" v-model="password" id="password" placeholder="Enter your password" />
        </div>
        <button class="login-button" v-on:click="login">Login</button>
        <div class="signup-link">
          <router-link to="/signup" class="signup-text">Don't have an account? Sign Up</router-link>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import axios from 'axios';
import HeaderBar from './HeaderBar.vue';

export default {
  name: 'LoginPage',
  components:{
    HeaderBar
  },
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("http://localhost:5254/api/Users/login", {
          email: this.email,
          password: this.password
        });
        console.log("Login successful:", response.data);

        // Store user information in local storage
        localStorage.setItem('user-info', JSON.stringify(response.data));
        localStorage.setItem('user-role', response.data.role);

        // If user is an owner, store the ownerId in localStorage
        if (response.data.role === 'Owner') {
          localStorage.setItem('ownerId', response.data.id);
        }

        // Redirect based on role
        if (response.data.role === 'Owner') {
          this.$router.push({ name: 'OwnerPage' });
        } else {
          this.$router.push({ name: 'HomePage' });
        }


      } catch (error) {
        console.error("Error logging in:", error.response ? error.response.data.message : error.message);
        alert(error.response ? error.response.data.message : "Error logging in");
      }
    }
  },
  
};
</script>



<style>
.login-container {
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
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.form-container h1 {
  margin-bottom: 20px;
  color: #333;
}

.login-form {
  width: 300px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.login-form h1 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  color: #555;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button.login-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

button.login-button:hover {
  background-color: #0056b3;
}

.signup-link {
  text-align: center;
  margin-top: 15px;
}

.signup-text {
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.signup-text:hover {
  color: #0056b3;
}
</style>