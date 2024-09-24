require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const validator = require('validator'); // For input sanitization
const rateLimit = require('express-rate-limit'); // For rate limiting

const jwtSecret = process.env.JWT_SECRET;
const app = express();
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// DATABASE CONNECTION
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
});

// Nodemailer transporter
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

// Validation schemas
const signupSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    mobile_number: Joi.string().pattern(/^[0-9]+$/).length(10).required(),
    password: Joi.string().min(6).required(),
});

// Signup endpoint
app.post('/signup', async (req, res) => {
    try {
        // Sanitize inputs
        req.body.name = validator.escape(req.body.name);
        req.body.email = validator.normalizeEmail(req.body.email);
        req.body.mobile_number = validator.escape(req.body.mobile_number);
        req.body.password = req.body.password;

        const { error } = signupSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }

        const { name, email, mobile_number, password } = req.body;

        // Check for existing user
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR mobile_number = $2',
            [email, mobile_number]
        );

        if (existingUser.rowCount > 0) {
            return res.status(409).send({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

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

// OTP validation schema
const otpSchema = Joi.object({
    email: Joi.string().email().required(),
    mobile_number: Joi.string().pattern(/^[0-9]+$/).length(10).required(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
});

// Validate OTP endpoint
app.post('/validate-otp', async (req, res) => {
    try {
        // Sanitize inputs
        req.body.email = validator.normalizeEmail(req.body.email);
        req.body.mobile_number = validator.escape(req.body.mobile_number);
        req.body.otp = validator.escape(req.body.otp);

        const { error } = otpSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }

        const { email, mobile_number, otp } = req.body;

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
        console.error('Error during OTP validation:', error);
        res.status(500).send({ error: 'Error during OTP validation' });
    }
});

// Login schema
const loginSchema = Joi.object({
    email_or_mobile: Joi.string().required(),
    password: Joi.string().required(),
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        // Sanitize inputs
        req.body.email_or_mobile = validator.escape(req.body.email_or_mobile);
        req.body.password = req.body.password;

        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }

        const { email_or_mobile, password } = req.body;

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
        console.error('Error during login:', error);
        res.status(500).send({ error: 'Error during login' });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));