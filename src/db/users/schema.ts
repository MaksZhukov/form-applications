import { DataTypes, ModelAttributes } from 'sequelize';

export const userSchema: ModelAttributes = {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true,
		unique: 'id'
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE,
	name: { type: DataTypes.STRING, allowNull: false, unique: 'name' },
	email: { type: DataTypes.STRING, allowNull: false, unique: 'email' },
	password: { type: DataTypes.STRING, allowNull: false },
	token: { type: DataTypes.STRING, defaultValue: '' },
	role: { type: DataTypes.ENUM('admin', 'regular'), allowNull: false }
};
