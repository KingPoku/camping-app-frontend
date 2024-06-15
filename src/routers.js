import Vue from 'vue';
import HomePage from "./components/HomePage.vue";
import SignUpForm from "./components/SignUpForm.vue";
import LoginPage from "./components/LoginPage.vue";
import ImageComponet from "./components/ImageComponent.vue";
import BookNow from "./components/BookNow.vue";
import CampSites from "./components/CampSites.vue";
import BookingPage from "./components/BookingPage.vue";
import ContactPage from "./components/ContactPage.vue";
import UserProfile from "./components/UserProfile.vue";
import MyBookings from "./components/MyBookings.vue";
import OwnerRegister from "./components/OwnerRegister.vue";
import OwnerPage from "./components/OwnerPage.vue";

import VueRouter from 'vue-router';



Vue.use(VueRouter);

const routes = [
    {
        name: "HomePage",
        component: HomePage,
        path: "/"
    },
    {
        name: "SignUpForm",
        component: SignUpForm,
        path: "/signup"
    },
    {
        name: "LoginPage",
        component: LoginPage,
        path: "/login"
    },
    {
        name: "ImageComponent",
        component: ImageComponet,
        path: "/image"
    },
    {
        name: "BookNow",
        component: BookNow,
        path: "/bookNow",
        props: route => ({ selectedSpot: route.params.selectedSpot })
    },
    {
        name: "CampSites",
        component: CampSites,
        path: "/camp-sites"
    },
    {
        name: "BookingPage",
        component: BookingPage,
        path: "/booking/:spotID",
        props: true
    },
    {
        name: "ContactPage",
        component: ContactPage,
        path: "/contact"
    },
    {
        name: "UserProfile",
        component: UserProfile,
        path: "/profile"
    },
    {
        name: "MyBookings",
        component: MyBookings,
        path: "/bookings"
    },
    {
        name: "OwnerRegister",
        component: OwnerRegister,
        path: "/owner-register"
    },
    {
        name: "OwnerPage",
        component: OwnerPage,
        path: "/owner-page"
    }








];

const router = new VueRouter({
    mode: 'history',
    routes
});

export default router;