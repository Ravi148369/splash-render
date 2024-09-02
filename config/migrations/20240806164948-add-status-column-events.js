'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('events', 'status', {
      type: Sequelize.ENUM('deleted', 'pending', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'completed',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('events', 'status');

    // Drop the enum type if the database is PostgreSQL
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_events_status";');
  }
};
