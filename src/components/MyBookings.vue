<template>
    <div class="bookings-container">
        <h2>My Bookings</h2>
        <div v-if="bookings.length">
            <div v-for="booking in bookings" :key="booking.bookingID" class="booking-item">
                <p><strong>Spot ID:</strong> {{ booking.spotName }}</p>
                <p><strong>City:</strong> {{ booking.city }}</p>
                <p><strong>Check-In Date:</strong> {{ formatDate(booking.check_In_Date) }}</p>
                <p><strong>Check-Out Date:</strong> {{ formatDate(booking.check_Out_Date) }}</p>
                <p><strong>Total Price:</strong> ${{ booking.total_Price }}</p>
            </div>
        </div>
        <p v-else>No bookings found.</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            bookings: []
        };
    },
    created() {
        this.fetchBookings();
    },
    methods: {
        async fetchBookings() {
            try {
                const user = JSON.parse(localStorage.getItem('user-info'));
                const userId = user ? user.id : null;
                if (!userId) {
                    console.error('User ID not found.');
                    return;
                }
                const response = await axios.get(`http://localhost:5254/api/bookings/user/${userId}`);
                const bookings = response.data;

                // Fetch spot details for each booking
                for (const booking of bookings) {
                    const spotId = booking.spotID;
                    const spotResponse = await axios.get(`http://localhost:5254/api/CampingSpots/${spotId}`);
                    const spotDetails = spotResponse.data;
                    booking.spotName = spotDetails.spot_Name; 
                    booking.city = spotDetails.city;
                }

                this.bookings = response.data;
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        }
    }
};
</script>
<style scoped>
.bookings-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

.booking-item {
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

.booking-item p {
    margin: 5px 0;
}
</style>