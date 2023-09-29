import { DataTypes, ModelAttributes } from 'sequelize';

export const fileSchema: ModelAttributes = {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true,
		unique: true
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE,
	name: { type: DataTypes.STRING, allowNull: false },
	type: { type: DataTypes.STRING, allowNull: false },
};
