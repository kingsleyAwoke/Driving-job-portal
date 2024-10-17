module.exports = (sequelize, DataTypes) => {
    const VehicleOperator = sequelize.define('VehicleOperator', {
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        age: DataTypes.INTEGER,
        marital_status: DataTypes.STRING,
        school_qualification: DataTypes.STRING,
        vehicle_operation_experience: DataTypes.STRING,
        vehicle_type: DataTypes.STRING,
        availability: DataTypes.STRING,
        license_class: DataTypes.STRING,
        profile_picture: DataTypes.STRING,
        location: DataTypes.STRING,
    });

    VehicleOperator.associate = (models) => {
        VehicleOperator.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });
    };

    return VehicleOperator;
};