const { Users } = require('../models/Users');

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await Users.findByPk(req.user.id); // Get user from database
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ id: user.id, email: user.email, name: user.name }); // Return user profile
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Error fetching user profile.' });
    }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
    const { name, email } = req.body;

    try {
        const user = await Users.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update user details
        await Users.update({ name, email }, { where: { id: user.id } });

        res.json({ message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Error updating user profile.' });
    }
};

// Delete User Account
exports.deleteUserAccount = async (req, res) => {
    try {
        const user = await Users.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await Users.destroy({ where: { id: user.id } }); // Delete user from database
        res.json({ message: 'User account deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ error: 'Error deleting user account.' });
    }
};