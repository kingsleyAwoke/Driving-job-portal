const Users = require('../models/Users');

// Store refresh token in the database
async function storeRefreshToken(userId, refreshToken) {
    // Update the user record to store the refresh token
    await Users.update({ refreshToken }, { where: { id: userId } });
}

// Get refresh token from the database
async function getRefreshToken(refreshToken) {
    // Find a user with the specified refresh token
    const user = await Users.findOne({ where: { refreshToken } });
    return user; // Returns the user if found, otherwise returns null
}

// Revoke refresh token in the database
async function revokeRefreshToken(refreshToken) {
    // Remove the refresh token from the user's record
    await Users.update({ refreshToken: null }, { where: { refreshToken } });
}

module.exports = {
    storeRefreshToken,
    getRefreshToken,
    revokeRefreshToken,
};