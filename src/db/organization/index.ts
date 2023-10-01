import { Sequelize } from 'sequelize';
import { OrganizationModel } from './model';
import { organizationSchema } from './schema';

export const initOrganizationModel = async (sequelize: Sequelize) => {
	OrganizationModel.init(organizationSchema, { sequelize, modelName: 'organization' });
};
