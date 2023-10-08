'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('test', {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: Sequelize.STRING
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('test');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
