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
	name: { type: DataTypes.STRING, allowNull: false },
	email: { type: DataTypes.STRING, allowNull: false, unique: 'email' },
	departmentName: { type: DataTypes.STRING, allowNull: true },
	password: { type: DataTypes.STRING, allowNull: false },
	token: { type: DataTypes.STRING, defaultValue: '' },
	role: { type: DataTypes.ENUM('admin', 'regular'), allowNull: false },
	phone: { type: DataTypes.STRING },
	isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
};
