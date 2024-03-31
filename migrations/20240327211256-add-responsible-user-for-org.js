'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.addColumn('organizations', 'responsibleUserId', {
			type: Sequelize.INTEGER.UNSIGNED,
			references: { model: 'users', key: 'id' }
		});
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.removeColumn(
			'organizations', // name of Source model
			'responsibleUserId' // key we want to remove
		);
	}
};
