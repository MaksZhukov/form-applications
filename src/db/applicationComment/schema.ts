import { DataTypes, ModelAttributes } from 'sequelize';

export const applicationCommentSchema: ModelAttributes = {
	id: {
		type: DataTypes.INTEGER.UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	}
};
