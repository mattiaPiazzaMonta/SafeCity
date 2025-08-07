'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('emergencies', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      emergency_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'emergency_types',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'attiva'
      },
      location: {
        type: Sequelize.GEOGRAPHY('POINT', 4326),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('emergencies');
  }
};

