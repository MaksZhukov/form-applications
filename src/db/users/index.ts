import { Sequelize } from 'sequelize';
import { UserModel } from './model';
import { OrganizationModel } from '../organization/model';
import { userSchema } from './schema';
import { ApplicationModel } from '../application/model';

export const initUserModel = async (sequelize: Sequelize) => {
	UserModel.init(userSchema, { sequelize, modelName: 'user' });
	UserModel.belongsTo(OrganizationModel);
};
