import { DataTypes, ModelAttributes } from 'sequelize';

export const applicationLaborCostsSchema: ModelAttributes = {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true,
		unique: 'id'
	}
};
