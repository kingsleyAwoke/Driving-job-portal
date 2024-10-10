const Joi = require('joi');
const validator = require('validator');
const { sendOtp, sendEmail } = require('../utils/mailer')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Users = require('../models/Users');

// Validation schemas
const signupSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    mobile_number: Joi.string().pattern(/^[0-9]+$/).length(11).required(),
    password: Joi.string().min(6).required(),
});

// Signup controller function
exports.signup = async (req, res) => {
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
};

// OTP validation controller function
exports.validateOtp = async (req, res) => {
    try {
        const { email, mobile_number, otp } = req.body;

        // Validate OTP logic
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
};

// Login controller function
exports.login = async (req, res) => {
    try {
        const { email_or_mobile, password } = req.body;

        // Login logic
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
};

// Forgot password controller function
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const resetToken = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
        await sendEmail(email, 'Password Reset', `Click here to reset your password: ${resetLink}`);

        res.send({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).send({ error: 'Error during password reset' });
    }
};