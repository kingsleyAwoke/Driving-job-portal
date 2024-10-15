'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'age', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn('users', 'gender', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('users', 'marital_status', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('users', 'school_qualification', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('users', 'vehicle_operation_experience', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('users', 'license_class', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('users', 'profile_picture', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('users', 'location', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'age');
        await queryInterface.removeColumn('users', 'gender');
        await queryInterface.removeColumn('users', 'marital_status');
        await queryInterface.removeColumn('users', 'school_qualification');
        await queryInterface.removeColumn('users', 'vehicle_operation_experience');
        await queryInterface.removeColumn('users', 'license_class');
        await queryInterface.removeColumn('users', 'profile_picture');
        await queryInterface.removeColumn('users', 'location');
    }
};