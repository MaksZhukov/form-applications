import { Sequelize } from 'sequelize';
import { OrganizationModel } from '../organization/model';
import { ApplicationInternalModel } from './model';
import { applicationInternalSchema } from './schema';

export const initApplicationInternalModel = async (sequelize: Sequelize) => {
	ApplicationInternalModel.init(applicationInternalSchema, { sequelize, modelName: 'application_internal' });
	ApplicationInternalModel.belongsTo(OrganizationModel);
	await ApplicationInternalModel.sync({ alter: true });
};
