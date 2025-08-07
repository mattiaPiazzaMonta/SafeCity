'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('comments', 'photos', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      defaultValue: []
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('comments', 'photos');
  }
};

