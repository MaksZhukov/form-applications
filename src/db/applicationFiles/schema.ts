import { DataTypes, ModelAttributes } from 'sequelize';

export const applicationFileSchema: ModelAttributes = {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true,
		unique: true,
	},
};
