const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Users extends Model {}

Users.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),  // Set length to 100
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),  // Length is fine
        allowNull: false,
        unique: true,
    },
    mobile_number: {
        type: DataTypes.STRING(15),   // Set length to 15
        allowNull: false,
    },
    hashed_password: {
        type: DataTypes.STRING(255),   // Length is fine
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING(6),      // Set length to 6
        allowNull: true,
    },
    otp_expiry: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',  // Match database naming
    updatedAt: 'updated_at',  // Match database naming
});

module.exports = Users;