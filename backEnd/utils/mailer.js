const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAILGUN_HOST,
    port: process.env.MAILGUN_PORT,
    auth: {
        user: process.env.MAILGUN_USER,
        pass: process.env.MAILGUN_PASS
    }
});

// Helper function to send OTP
const sendOtp = (email, mobile_number, otp) => {
    const message = {
        from: 'noreply@sandbox8c46f4ed1b284f2a8e872fd4c449daf2.mailgun.org',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP Code is ${otp}`
    };

    transporter.sendMail(message, (error, info) => {
        if (error) {
            return console.error('Error sending email:', error);
        }
        console.log('Email sent:', info.response);
    });
};

// Function to send an email
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'noreply@sandbox8c46f4ed1b284f2a8e872fd4c449daf2.mailgun.org',
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        }
        console.log('Email sent:', info.response);
    });
};

module.exports = { sendOtp, sendEmail };