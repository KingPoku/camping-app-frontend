<template>
  <div class="header-bar">
    <div class="app-name">King's Nexus</div>
    <nav>
      <a v-on:click="home" href="#">Home</a>
      <a v-on:click="camps" href="#">Sites</a>
      <a v-on:click="contact" href="#">Contact</a>
      <a v-on:click="becomeOwner" href="#">Become an owner</a>
      <a v-on:click="host" href="#">Host/Login</a>
      <a v-on:click="logout" href="#">Logout</a>
      <a @click="profile" href="#">
        <span class="material-icons avatar-icon">account_circle</span>
      </a>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'HeaderBar',
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({ name: 'LoginPage' });
    },
    home() {
      if (this.$route.name !== 'HomePage') {
        this.$router.push({ name: 'HomePage' });
      }
    },
    camps() {
      if (this.$route.name !== 'CampSites') {
        this.$router.push({ name: 'CampSites' });
      }
    },
    contact() {
      if (this.$route.name !== 'ContactPage') {
        this.$router.push({ name: 'ContactPage' });
      }
    },
    profile() {
      if (this.$route.name !== 'UserProfile') {
        this.$router.push({ name: 'UserProfile' });
      }
    },
    host() {
      /*const ownerId = localStorage.getItem('user-info') && JSON.parse(localStorage.getItem('user-info')).Id;*/
      const userRole = localStorage.getItem('user-role');
      if (/*ownerId &&*/ userRole === 'Owner') {
        if (this.$route.name !== 'OwnerPage') {
          this.$router.push({ name: 'OwnerPage' });
        }
      } else {
        if (this.$route.name !== 'LoginPage') {
          this.$router.push({ name: 'LoginPage' });
        }
      }

    },
    becomeOwner() {
      if (this.$route.name !== 'OwnerRegister') {
        this.$router.push({ name: 'OwnerRegister' });
      }
    }

  }
}

</script>

<style scoped>
.header-bar {
  background-color: #2E8B57;
  padding: 20px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  /* Adjust to space between app name and links */
  align-items: center;
}

.app-name {
  color: #f7f1e3;
  /* Creamy white text color */
  font-size: 28px;
  /* Larger font size */
  font-weight: bold;
  margin-left: 20px;
  /* Add some margin to the left */
}

.header-bar nav {
  display: flex;
  align-items: center;
}

.header-bar a {
  color: #f7f1e3;
  /* Creamy white text color */
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 20px;
  margin-right: 20px;
  /* Add some space between links */
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  /* Light overlay for better readability */
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.header-bar a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.header-bar a:active {
  background-color: rgba(255, 255, 255, 0.4);
  transform: translateY(0);
}

.header-bar a:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}
</style>