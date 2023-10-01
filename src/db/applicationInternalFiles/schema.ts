import { DataTypes, ModelAttributes } from 'sequelize';

export const applicationInternalFileSchema: ModelAttributes = {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true,
		unique: true
	}
};
