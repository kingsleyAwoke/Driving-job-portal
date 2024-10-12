const express = require('express');
const authenticateJWT = require('../middleware/auth');
const profileController = require('../controllers/profileController'); 
const router = express.Router();

// Get User Profile
router.get('/profile', authenticateJWT, profileController.getUserProfile);

// Update User Profile
router.put('/profile', authenticateJWT, profileController.updateUserProfile);

// Delete User Account
router.delete('/profile', authenticateJWT, profileController.deleteUserAccount);

module.exports = router;