exports.setupVehicleOperator = async (req, res) => {
    const userId = req.user.id;
    const {
        age,
        gender,
        marital_status,
        school_qualification,
        vehicle_operation_experience,
        vehicle_type,
        availability,
        profile_picture,
        location,
        license_class
    } = req.body;

    try {
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update user details to mark as operator and add additional info
        await Users.update(
            {
                is_operator: true,
                age,
                gender,
                marital_status,
                school_qualification,
                vehicle_operation_experience,
                vehicle_type,
                availability,
                profile_picture,
                location,
                license_class
            },
            { where: { id: userId } }
        );

        res.json({ message: 'Vehicle operator setup completed successfully.' });
    } catch (error) {
        console.error('Error setting up vehicle operator:', error);
        res.status(500).json({ error: 'Error setting up vehicle operator.' });
    }
};