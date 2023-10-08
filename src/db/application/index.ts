import { Sequelize } from 'sequelize';
import { OrganizationModel } from '../organization/model';
import { ApplicationModel } from './model';
import { applicationSchema } from './schema';
import { UserModel } from '../users/model';

export const initApplicationModel = async (sequelize: Sequelize) => {
	ApplicationModel.init(applicationSchema, { sequelize, modelName: 'application' });
	ApplicationModel.belongsTo(OrganizationModel);
	ApplicationModel.belongsTo(UserModel, {
		foreignKey: 'responsibleUserId',
		as: 'responsibleUser'
	});
};
