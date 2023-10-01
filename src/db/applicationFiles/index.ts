import { Sequelize } from 'sequelize';
import { ApplicationFileModel } from './model';
import { applicationFileSchema } from './schema';

export const initApplicationFileModel = (sequelize: Sequelize) => {
	ApplicationFileModel.init(applicationFileSchema, { sequelize, modelName: 'application_files', timestamps: false });
};
