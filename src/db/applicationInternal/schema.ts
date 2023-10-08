import { DataTypes, ModelAttributes } from 'sequelize';

export const applicationInternalSchema: ModelAttributes = {
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
	comment: { type: DataTypes.STRING },
	redirection: { type: DataTypes.STRING },
	departmentName: { type: DataTypes.STRING },
	forWhom: { type: DataTypes.STRING },
	status: { type: DataTypes.ENUM('в обработке', 'в работе', 'выполнено'), allowNull: false },
	isUrgent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
	isArchived: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
};
