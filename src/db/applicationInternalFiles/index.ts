import { Sequelize } from 'sequelize';
import { ApplicationInternalFileModel } from './model';
import { applicationInternalFileSchema } from './schema';

export const initApplicationInternalFileModel = async (sequelize: Sequelize) => {
	ApplicationInternalFileModel.init(applicationInternalFileSchema, {
		sequelize,
		modelName: 'application_internal_files',
		timestamps: false
	});
	await ApplicationInternalFileModel.sync({ alter: true });
};
