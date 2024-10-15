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
    is_operator: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Initially, the user is not a vehicle operator
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional, to be filled later
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, to be filled later
    },
    marital_status: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, to be filled later
    },
    school_qualification: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, to be filled later
    },
    vehicle_operation_experience: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, to be filled later
    },
    vehicle_type: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, to be filled later
    },
    availability: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, to be filled later
    },
    profile_picture: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, to be filled later
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, to be filled later
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true, // Optional, to be filled later
    },
    license_class: {
      type: DataTypes.STRING,
      allowNull: true,
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Users;