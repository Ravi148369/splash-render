'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new ENUM value 'super strict' to the column 'cancellation_policy'
    await queryInterface.sequelize.query(`
      ALTER TABLE events
      MODIFY COLUMN cancellation_policy ENUM('flexible', 'moderate', 'strict', 'super strict') DEFAULT 'flexible';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback: Remove the 'super strict' value from the ENUM
    // If the column has data with 'super strict', this operation might fail. Handle with care.
    await queryInterface.sequelize.query(`
      ALTER TABLE events
      MODIFY COLUMN cancellation_policy ENUM('flexible', 'moderate', 'strict') DEFAULT 'flexible';
    `);
  }
};
