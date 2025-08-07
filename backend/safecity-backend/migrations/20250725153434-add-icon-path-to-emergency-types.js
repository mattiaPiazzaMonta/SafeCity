'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('emergency_types', 'icon_path', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '', //gestire righe già esistenti
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('emergency_types', 'icon_path');
  }
};
