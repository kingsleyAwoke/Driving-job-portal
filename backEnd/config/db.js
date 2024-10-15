require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('./config');

// Determine the environment (default to 'development')
const environment = process.env.NODE_ENV;
const dbConfig = config[environment];

// Sequelize instance
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    logging: false, // Disable logging; set to true for debugging
});

// Test the database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// Call the connection test
testConnection();

module.exports = sequelize;