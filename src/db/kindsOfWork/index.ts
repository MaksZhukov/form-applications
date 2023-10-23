import { Sequelize } from 'sequelize';
import { kindsOfWorkSchema } from './schema';
import { KindsOfWorkModel } from './model';

export const initKindsOfWorkModel = async (sequelize: Sequelize) => {
	KindsOfWorkModel.init(kindsOfWorkSchema, { sequelize, modelName: 'kinds_of_work' });
	// KindsOfWorkModel.sync({ alter: true });
};
