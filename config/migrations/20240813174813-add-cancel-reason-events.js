'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('events', 'cancel_reason', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn('events', 'canceled_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('events', 'cancel_reason');
    await queryInterface.removeColumn('events', 'canceled_at');
  }
};
