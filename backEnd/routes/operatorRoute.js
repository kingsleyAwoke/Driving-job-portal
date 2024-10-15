const express = require('express');
const operatorController = require('../controllers/operatorController');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

// Setup vehicle operator route
router.post('/setup-operator', authenticateJWT, operatorController.setupVehicleOperator);

module.exports = router;