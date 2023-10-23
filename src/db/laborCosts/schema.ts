import { DataTypes, ModelAttributes } from 'sequelize';

export const laborCostsSchema: ModelAttributes = {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true,
		unique: 'id'
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE,
	date: DataTypes.DATE,
    timeSpent: DataTypes.STRING,
};