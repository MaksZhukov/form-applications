import { Sequelize } from 'sequelize';
import { OrganizationModel } from '../organization/model';
import { ApplicationInternalModel } from './model';
import { applicationInternalSchema } from './schema';
import { UserModel } from '../users/model';

export const initApplicationInternalModel = async (sequelize: Sequelize) => {
	ApplicationInternalModel.init(applicationInternalSchema, { sequelize, modelName: 'application_internal' });
	ApplicationInternalModel.belongsTo(UserModel, {
		foreignKey: 'responsibleUserId',
		as: 'responsibleUser'
	});
	ApplicationInternalModel.belongsTo(UserModel, {
		foreignKey: 'employeeId',
		as: 'employee'
	});
	ApplicationInternalModel.belongsTo(OrganizationModel, { constraints: false });
	ApplicationInternalModel.sync({ alter: true });
};
