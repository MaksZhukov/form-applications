import { DataTypes, ModelAttributes } from 'sequelize';

export const commentSchema: ModelAttributes = {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true,
		unique: 'id'
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE,
	text: { type: DataTypes.STRING, allowNull: false }
};
