import { Sequelize } from 'sequelize';
import { applicationInternalSchema } from '../applicationInternal/schema';
import { ApplicationInternalFileModel } from './model';

export const initApplicationInternalFileModel = (sequelize: Sequelize) => {
	ApplicationInternalFileModel.init(applicationInternalSchema, {
		sequelize,
		modelName: 'application_internal_files',
		timestamps: false
	});
};
