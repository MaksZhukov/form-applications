import { DataTypes, ModelAttributes } from 'sequelize';

export const applicationSchema: ModelAttributes = {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true,
		unique: 'id'
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE,
	title: { type: DataTypes.STRING, allowNull: false },
	description: { type: DataTypes.STRING(2500), allowNull: false },
	deadline: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
	phone: { type: DataTypes.STRING, defaultValue: '' },
	comment: { type: DataTypes.STRING, defaultValue: '' },
	name: { type: DataTypes.STRING, allowNull: false },
	status: { type: DataTypes.ENUM('в обработке', 'в работе', 'выполнено'), allowNull: false },
	email: { type: DataTypes.STRING, allowNull: false },
	isUrgent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	isArchived: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
};
