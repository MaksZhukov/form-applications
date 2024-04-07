import { DataTypes, ModelAttributes } from 'sequelize';

export const organizationSchema: ModelAttributes = {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true,
		unique: 'id'
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE,
	name: { type: DataTypes.STRING, allowNull: false, unique: 'name' },
	uid: { type: DataTypes.STRING, allowNull: false, unique: 'uid' },
	address: { type: DataTypes.STRING },
	email: { type: DataTypes.STRING },
	phone: { type: DataTypes.STRING }
};
