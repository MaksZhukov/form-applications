import { Sequelize } from 'sequelize';
import { OrganizationModel } from '../organization/model';
import { ApplicationModel } from './model';
import { applicationSchema } from './schema';

export const initApplicationModel = (sequelize: Sequelize) => {
	ApplicationModel.init(applicationSchema, { sequelize, modelName: 'application' });
	ApplicationModel.belongsTo(OrganizationModel);
};
