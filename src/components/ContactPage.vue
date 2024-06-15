<template>
    <div class="contact-page">
        <HeaderBar />

        <div class="contact-container">
            <div class="contact-info">
                <h1>Contact Us</h1>
                <p>If you have any questions, feel free to reach out to us using the form below.</p>
                <p><strong>Address:</strong> Zandpoortvest 60, Mechelen, Belgium</p>
                <p><strong>Phone:</strong> +32 456 7890 25</p>
                <p><strong>Email:</strong> king@gmail.com</p>
            </div>

            <form class="contact-form" @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" v-model="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email" required>
                </div>
                <div class="form-group">
                    <label for="subject">Subject</label>
                    <input type="text" id="subject" v-model="subject" required>
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" v-model="message" required></textarea>
                </div>
                <button type="submit" class="submit-button">Send Message</button>
            </form>
        </div>

        <div class="map-container">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10080.476481214114!2d4.4805917!3d51.0246478!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c15072b8d4e24b%3A0x68145b5f23530893!2sZandpoortvest%2060%2C%202800%20Mechelen%2C%20Belgium!5e0!3m2!1sen!2sus!4v1683795486347!5m2!1sen!2sus"
                width="100%" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false"
                tabindex="0">
            </iframe>
        </div>

        <!-- Success Modal -->
        <div class="modal" v-if="showSuccessModal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <h2>Message Sent Successfully!</h2>
                <div class="success-details">
                    <p><strong>Name:</strong> {{ name }}</p>
                    <p><strong>Email:</strong> {{ email }}</p>
                    <p><strong>Subject:</strong> {{ subject }}</p>
                    <p><strong>Message:</strong> {{ message }}</p>
                </div>
                <div class="success-message">
                    Your message has been sent successfully.
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import HeaderBar from './HeaderBar.vue';

export default {
    name: 'ContactPage',
    components: {
        HeaderBar
    },
    data() {
        return {
            name: '',
            email: '',
            subject: '',
            message: '',
            showSuccessModal: false
        };
    },
    methods: {
        submitForm() {

            this.showSuccessModal = true;

            // Clear the form
            this.clearForm();

            // Hide the success modal after 3 seconds
            setTimeout(() => {
                this.closeModal();
            }, 3000);
        },
        closeModal() {
            // Close success modal and clear the form
            this.showSuccessModal = false;
            this.clearForm();
        },
        clearForm() {
            // Clear form fields
            this.name = '';
            this.email = '';
            this.subject = '';
            this.message = '';
        }
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');

.contact-page {
    margin-bottom: 20px;
    padding: 20px;
    font-family: 'Montserrat', Arial, sans-serif;
    background-color: #f4f6f8;
}

.contact-container {
    max-width: 800px;
    width: 100%;
    margin: 20px auto;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-info {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.contact-info h1 {
    margin-bottom: 10px;
    font-size: 2.5em;
}

.contact-info p {
    margin-bottom: 10px;
    font-size: 1.1em;
}

.contact-form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1em;
    background-color: #f9f9f9;
    transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
    border-color: #007bff;
    background-color: #fff;
}

.form-group textarea {
    resize: vertical;
    min-height: 120px;
}

.submit-button {
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: #fff;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
}

.submit-button:hover {
    background-color: #0056b3;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.modal {
    display: block; 
    position: fixed; 
    z-index: 1000; 
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
    animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
    background-color: #fff;
    margin: 15% auto; 
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    width: 80%; 
    max-width: 600px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-in-out;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.close:hover,
.close:focus {
    color: #333;
    text-decoration: none;
}

.success-details p {
    margin: 10px 0;
    font-size: 1.1em;
    color: #555;
}

.success-message {
    color: green;
    margin-top: 10px;
    font-size: 1.2em;
}

.map-container {
    width: 100%;
    margin-top: 20px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideIn {
    from { transform: translateY(-50px); }
    to { transform: translateY(0); }
}
</style>
