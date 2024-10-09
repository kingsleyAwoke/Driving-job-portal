const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');

// Signup endpoint
router.route('/signup').post(userController.signup);

// Validate OTP endpoint
router.route('/validate-otp').post(userController.validateOtp);

// Login endpoint
router.route('/login').post(userController.login);

// Forgot password endpoint
router.route('/forgot-password').post(userController.forgotPassword);

module.exports = router;