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
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    mobile_number: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    hashed_password: {
        type: DataTypes.STRING(255), 
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING(6),
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Users;