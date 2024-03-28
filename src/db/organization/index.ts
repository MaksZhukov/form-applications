import { Sequelize } from 'sequelize';
import { OrganizationModel } from './model';
import { organizationSchema } from './schema';
import { UserModel } from '../users/model';

export const initOrganizationModel = async (sequelize: Sequelize) => {
	OrganizationModel.init(organizationSchema, { sequelize, modelName: 'organization' });
};
export const initOrganizationModelRelations = () => {
	OrganizationModel.belongsTo(UserModel, {
		foreignKey: 'responsibleUserId',
		as: 'responsibleUser'
	});
};
