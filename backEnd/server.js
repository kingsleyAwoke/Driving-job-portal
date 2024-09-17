require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
//const nodemailer = require('nodemailer');
const Mailgun = require('mailgun-js');
const formData = require('form-data');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwtSecret = process.env.JWT_SECRET;
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added for form data

// MAIL API
const mailgun = new Mailgun(formData);
const mg = mailgun({ apiKey: process.env.MAIL_API_KEY, domain: process.env.MAIL_DOMAIN });

// DATABASE CONNECTION
const pool = new Pool({
    user: "kingsley",
    host: "localhost",
    database: 'jobseek_db',
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
});


// Helper function to send OTP
const sendOtp = (email, mobile_number, otp) => {
    mg.messages.create('sandbox8c46f4ed1b284f2a8e872fd4c449daf2.mailgun.org', {
        from: "noreply@sandbox8c46f4ed1b284f2a8e872fd4c449daf2.mailgun.org", 
        to: [email],
        subject: 'Your OTP Code',
        text: `Your OTP Code is ${otp}`,
    })
    .then(msg => console.log('Email sent:', msg))
    .catch(err => console.error('Error sending email:', err));
};



// Signup endpoint
app.post('/signup', async (req, res) => {
    const { name, email, mobile_number, password } = req.body;
    console.log('Request Body:', req.body);

    // Validate input
   // if (!name || !email || //!mobile_number || !password) {
       // return res.status(400).send({ //error: 'All fields are //required' });
    //}

    // Check for existing user
    const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1 OR mobile_number = $2',
        [email, mobile_number]
    );

    if (existingUser.rowCount > 0) {
        return res.status(409).send({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash("password", 10);
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    console.log('Hashed Password:', hashedPassword);
    console.log('OTP:', otp);
    console.log('OTP Expiry:', otpExpiry);

    try {
        await pool.query(
            'INSERT INTO users (name, email, mobile_number, hashed_password, otp, otp_expiry) VALUES ($1, $2, $3, $4, $5, $6)',
            [name, email, mobile_number, hashedPassword, otp, otpExpiry]
        );

        await sendOtp(email, mobile_number, otp);
        res.status(201).send({ message: 'Signup successful. OTP sent.' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send({ error: 'Error during signup' });
    }
});

// Validate OTP endpoint
app.post('/validate-otp', async (req, res) => {
    const { email, mobile_number, otp } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE (email = $1 OR mobile_number = $2) AND otp = $3 AND otp_expiry > NOW()',
            [email, mobile_number, otp]
        );

        if (result.rowCount === 0) {
            return res.status(400).send({ error: 'Invalid or expired OTP' });
        }

        await pool.query(
            'UPDATE users SET otp = NULL, otp_expiry = NULL WHERE email = $1 OR mobile_number = $2',
            [email, mobile_number]
        );

        res.send({ message: 'OTP validated successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Error during OTP validation' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email_or_mobile, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR mobile_number = $2',
            [email_or_mobile, email_or_mobile]
        );

        if (result.rowCount === 0) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.hashed_password);

        if (!isMatch) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h', algorithm: 'HS256' });
        res.send({ token });
    } catch (error) {
        res.status(500).send({ error: 'Error during login' });
    }
});


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
