const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');

// Signup endpoint
router.route('/signup').post(userController.signup);

// Validate OTP endpoint
router.route('/validate-otp').post(userController.validateOtp);

// Login endpoint
router.route('/login').post(userController.login);

// Refresh token endpoint
router.route('/refresh-token').post(userController.refreshToken);

// Logout endpoint
router.route('/logout').post(userController.logout);

// Forgot password endpoint
router.route('/forgot-password').post(userController.forgotPassword);

//Reset password
router.route('/reset-password').post(userController.resetPassword)

module.exports = router;