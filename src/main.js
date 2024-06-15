import Vue from 'vue';
import App from './App.vue';
import router from './routers'; // Import your router file
import { Icon } from 'leaflet'; // Import Leaflet Icon
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

// Fix Leaflet's icon issue
delete Icon.Default.prototype._getIconUrl;

Vue.config.productionTip = false;

new Vue({
  router, // Register the router
  render: h => h(App),
}).$mount('#app');
