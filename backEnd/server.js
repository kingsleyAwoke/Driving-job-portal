require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const validator = require('validator');
const rateLimit = require('express-rate-limit');
const { Sequelize } = require('sequelize');
const Users = require('./models/Users');
const config = require('./config/config');

const jwtSecret = process.env.JWT_SECRET;
const app = express();
const PORT = process.env.PORT;

// Database connection setup
const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const dbUrl = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
console.log(dbUrl); 

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
}));

const sequelize = new Sequelize(dbUrl, { logging: false });

// Test database connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.error('Unable to connect to the database:', err));

// Sync database
const syncDatabase = async () => {
    try {
        await sequelize.sync();
        console.log('Database synced successfully!');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

// Middleware for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

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
    mobile_number: Joi.string().pattern(/^[0-9]+$/).length(11).required(),
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
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).send({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create the new user
        await Users.create({
            name,
            email,
            mobile_number,
            hashed_password: hashedPassword,
            otp,
            otp_expire: otpExpiry,
        });

        // Send OTP
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
    mobile_number: Joi.string().pattern(/^[0-9]+$/).length(11).required(),
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

        // Validate OTP
        const user = await Users.findOne({ where: { email, mobile_number } });
        if (!user || user.otp !== otp || user.otp_expire < new Date()) {
            return res.status(400).send({ error: 'Invalid or expired OTP' });
        }

        // If valid, clear OTP and expiry
        await Users.update({ otp: null, otp_expire: null }, { where: { email, mobile_number } });
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

        // Find user by email or mobile number
        const user = await Users.findOne({
            where: {
                [Op.or]: [
                    { email: email_or_mobile },
                    { mobile_number: email_or_mobile }
                ]
            }
        });

        if (!user) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.hashed_password);
        if (!isMatch) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h', algorithm: 'HS256' });
        res.send({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ error: 'Error during login' });
    }
});

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

// Forgot password
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Generate a reset token
        const resetToken = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });

        // Send email with reset link
        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
        
        // Send the email with the reset link
        await sendEmail(email, 'Password Reset', `Click here to reset your password: ${resetLink}`);

        res.send({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).send({ error: 'Error during password reset' });
    }
});

// Start syncing database and server
syncDatabase().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});