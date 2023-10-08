import { Sequelize } from 'sequelize';
import { FileModel } from './model';
import { fileSchema } from './schema';
import { ApplicationFileModel } from '../applicationFiles/model';
import { ApplicationModel } from '../application/model';
import { ApplicationInternalModel } from '../applicationInternal/model';
import { ApplicationInternalFileModel } from '../applicationInternalFiles/model';

export const initFileModel = async (sequelize: Sequelize) => {
	FileModel.init(fileSchema, { sequelize, modelName: 'file' });
	FileModel.belongsToMany(ApplicationModel, { through: ApplicationFileModel, onDelete: 'CASCADE' });
	ApplicationModel.belongsToMany(FileModel, { through: ApplicationFileModel, onDelete: 'CASCADE' });

	FileModel.belongsToMany(ApplicationInternalModel, { through: ApplicationInternalFileModel, onDelete: 'CASCADE' });
	ApplicationInternalModel.belongsToMany(FileModel, { through: ApplicationInternalFileModel, onDelete: 'CASCADE' });
	await FileModel.sync({ alter: true });
	await ApplicationInternalFileModel.sync({ alter: true });
};
