'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.addColumn('organizations', 'address', {
			type: Sequelize.STRING
		});
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.removeColumn('organizations', 'address');
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	}
};
