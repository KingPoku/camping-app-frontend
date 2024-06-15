
export default {
    computed: {
      currentUser() {
        const user = localStorage.getItem('user-info');
        return user ? JSON.parse(user) : null;
      }
    },
    methods: {
      logout() {
        localStorage.removeItem('user-info');
        this.$router.push({ name: 'LoginPage' });
      }
    }
  };
  