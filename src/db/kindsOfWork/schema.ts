import { DataTypes, ModelAttributes } from 'sequelize';

export const kindsOfWorkSchema: ModelAttributes = {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true,
		unique: 'id'
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE,
	name: DataTypes.STRING
};
