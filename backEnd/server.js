require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
}));

// Rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Middleware for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Use user routes
app.use('/', userRoutes);



// Start syncing database and server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        await sequelize.sync();
        console.log('Database synced successfully!');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

startServer();