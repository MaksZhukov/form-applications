'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn('organizations', 'email', {
				type: Sequelize.STRING
			}),
			queryInterface.addColumn('organizations', 'phone', {
				type: Sequelize.STRING
			})
		]);
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
	},

	async down(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.removeColumn('organizations', 'email'),
			queryInterface.removeColumn('organizations', 'phone')
		]);
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	}
};
