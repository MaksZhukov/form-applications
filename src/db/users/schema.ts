import { DataTypes, ModelAttributes } from 'sequelize';

export const userSchema: ModelAttributes = {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE,
	name: { type: DataTypes.STRING, allowNull: false, unique: true },
	email: { type: DataTypes.STRING, allowNull: false, unique: true },
	password: { type: DataTypes.STRING, allowNull: false },
	token: { type: DataTypes.STRING, defaultValue: '' },
	role: { type: DataTypes.ENUM('admin', 'regular'), allowNull: false }
};
