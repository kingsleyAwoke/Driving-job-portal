require('dotenv').config();
const axios = require('axios');

const mailgunDomain = process.env.MAILGUN_DOMAIN;
const mailgunAPIKey =process.env.MAILGUN_API_KEY;

// Helper function to send OTP
const sendOtp = async (email, otp) => {
    const message = {
        from: `noreply@${mailgunDomain}`,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP Code is ${otp}`,
    };

    try {
        const response = await axios.post(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, new URLSearchParams(message), {
            auth: {
                username: 'api',
                password: mailgunAPIKey,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log('Email sent:', response.data);
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.data : error.message);
    }
};

// Function to send a general email
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: `noreply@${mailgunDomain}`,
        to,
        subject,
        text,
    };

    try {
        const response = await axios.post(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, new URLSearchParams(mailOptions), {
            auth: {
                username: 'api',
                password: mailgunAPIKey,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log('Email sent:', response.data);
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.data : error.message);
    }
};

module.exports = { sendOtp, sendEmail };