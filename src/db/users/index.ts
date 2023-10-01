import { Sequelize } from 'sequelize';
import { UserModel } from './model';
import { OrganizationModel } from '../organization/model';
import { userSchema } from './schema';

export const initUserModel = (sequelize: Sequelize) => {
	UserModel.init(userSchema, { sequelize, modelName: 'user' });
	UserModel.belongsTo(OrganizationModel);
};
