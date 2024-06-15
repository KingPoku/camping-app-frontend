<template>
    <div>
        <HeaderBar />
        <div class="profile-container">
            <h2>Personal Info</h2>
            <div class="info-section">
                <div class="info-item">
                    <span>First Name</span>
                    <div>
                        <span>{{ user.first_Name }}</span>
                        <button @click="editField('first_Name')">Edit</button>
                    </div>
                </div>
                <div class="info-item">
                    <span>Last Name</span>
                    <div>
                        <span>{{ user.last_Name }}</span>
                        <button @click="editField('last_Name')">Edit</button>
                    </div>
                </div>
                <div class="info-item">
                    <span>Email address</span>
                    <div>
                        <span>{{ user.email }}</span>
                        <button @click="editField('email')">Edit</button>
                    </div>
                </div>
                <div class="info-item">
                    <span>Password</span>
                    <div>
                        <button @click="changePassword">Change</button>
                    </div>
                </div>
            </div>
            <button @click="viewBookings">My bookings</button>

            <!-- Edit Field Modal -->
            <modal-dialog v-if="editMode" @close="editMode = false">
                <h3>Edit {{ currentField }}</h3>
                <input v-model="editValue" type="text" />
                <button @click="saveEdit">Save</button>
            </modal-dialog>

            <!-- Change Password Modal -->
            <modal-dialog v-if="passwordMode" @close="passwordMode = false">
                <h3>Change Password</h3>
                <input v-model="password" type="password" placeholder="New Password" />
                <input v-model="confirmPassword" type="password" placeholder="Confirm Password" />
                <button @click="savePassword">Save</button>
            </modal-dialog>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import ModalDialog from './ModalDialog.vue';
import HeaderBar from './HeaderBar.vue';

export default {
    name: 'UserProfile',
    components: {
        ModalDialog,
        HeaderBar
    },
    data() {
        return {
            user: {},
            editMode: false,
            passwordMode: false,
            currentField: '',
            editValue: '',
            password: '',
            confirmPassword: ''
        };
    },
    methods: {
        async fetchUserData() {
            // Fetch user data based on the user's role and ID
            try {
                const userInfo = JSON.parse(localStorage.getItem('user-info')); // Get user info from local storage
                const role = userInfo.role;
                const userId = userInfo.id;

                // Fetch user data from API based on role
                const response = await axios.get(`http://localhost:5254/api/${role.toLowerCase()}${role === 'Owner' ? '' : 's'}/${userId}`);
                this.user = response.data;  // Store fetched user data in 'user' object
                console.log(this.user); // Log user data to console (for debugging)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        },
        editField(field) {
             // Prepare to edit a specific field in the user's profile
            this.currentField = field; // Set the current field being edited
            this.editValue = this.user[field];
            this.editMode = true; // Enable edit mode
        },
        async saveEdit() {
             // Save changes to the edited field in the user's profile
            try {
                const userInfo = JSON.parse(localStorage.getItem('user-info')); // Get user info from local storage
                const role = userInfo.role;
                const userId = userInfo.id;

                 // Create a copy of the user object with the updated field value
                const updatedUser = { ...this.user };
                updatedUser[this.currentField] = this.editValue;  // Update the field value

                // Constructing the update object to match the backend format
                const updateObject = {
                    Email: updatedUser.email,
                    First_Name: updatedUser.first_Name,
                    Last_Name: updatedUser.last_Name,
                };

                 // Adjust the update object based on the specific field being edited
                if (this.currentField === 'email') {
                    updateObject.Email = this.editValue;
                } else if (this.currentField === 'first_Name') {
                    updateObject.First_Name = this.editValue;
                } else if (this.currentField === 'last_Name') {
                    updateObject.Last_Name = this.editValue;
                }

                 // Send the updated field value to the API
                await axios.put(`http://localhost:5254/api/${role.toLowerCase()}${role === 'Owner' ? '' : 's'}/${userId}`, updateObject);
                this.user[this.currentField] = this.editValue;
                this.editMode = false;
            } catch (error) {
                console.error('Error updating user data:', error);
            }
        },
        changePassword() {
            // Enable password change mode
            this.passwordMode = true;
        },
        async savePassword() {
            if (this.password !== this.confirmPassword) {
                 // Check if passwords match
                alert('Passwords do not match');
                return;
            }
            try {
                const userInfo = JSON.parse(localStorage.getItem('user-info'));
                const role = userInfo.role;
                const userId = userInfo.id;

                const updatedField = { Password: this.password }; // Create an object with the new password


                 // Send the new password to the API
                await axios.put(`http://localhost:5254/api/${role.toLowerCase()}s/${userId}`, updatedField);

                this.passwordMode = false; // Disable password change mode
                alert('Password updated successfully!');

            } catch (error) {
                console.error('Error changing password:', error);
                alert('Error changing password. Please try again.');
            }
        },
        viewBookings() {
            this.$router.push('/bookings');
        }
    },
    mounted() {
        this.fetchUserData();
    }
};
</script>

<style scoped>
.profile-container {
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

.info-section {
    margin-bottom: 20px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
}

.info-item div {
    display: flex;
    align-items: center;
}

button {
    margin-left: 10px;
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>