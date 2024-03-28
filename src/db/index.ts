import mysql from 'mysql2';
import mysqlPromise from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import { ApplicationModel } from './application/model';
import { CommentModel } from './comment/model';
import { OrganizationModel } from './organization/model';
import { FileModel } from './file/model';
import { ApplicationCommentModel } from './applicationComment/model';
import { UserModel } from './users/model';
import { ApplicationFileModel } from './applicationFiles/model';
import { ApplicationInternalModel } from './applicationInternal/model';
import { ApplicationInternalFileModel } from './applicationInternalFiles/model';
import { ApplicationInternalCommentModel } from './applicationInternalComments/model';
import { initCommentsModel } from './comment';
import { initFileModel } from './file';
import { createDefaultOrganization } from './organization/default';
import { createDefaultUser } from './users/default';
import { initUserModel } from './users';
import { initOrganizationModel, initOrganizationModelRelations } from './organization';
import { initApplicationCommentModel } from './applicationComment';
import { initApplicationInternalCommentModel } from './applicationInternalComments';
import { initApplicationFileModel } from './applicationFiles';
import { initApplicationInternalFileModel } from './applicationInternalFiles';
import { initApplicationModel } from './application';
import { initApplicationInternalModel } from './applicationInternal';
import { initKindsOfWorkModel } from './kindsOfWork';
import { initLaborCostsModel } from './laborCosts';
import { LaborCostsModel } from './laborCosts/model';
import { initApplicationLaborCostsModel } from './applicationLaborCosts';
import { KindsOfWorkModel } from './kindsOfWork/model';
import { ApplicationLaborCostsModel } from './applicationLaborCosts/model';

let sequelize: Sequelize;

const models = {
	OrganizationModel,
	ApplicationModel,
	FileModel,
	CommentModel,
	UserModel,
	ApplicationCommentModel,
	ApplicationFileModel,
	ApplicationInternalModel,
	ApplicationInternalCommentModel,
	ApplicationInternalFileModel,
	LaborCostsModel,
	KindsOfWorkModel,
	ApplicationLaborCostsModel
};

export const initialize = async () => {
	if (sequelize) {
		return models;
	}
	const connection = await mysqlPromise.createConnection({
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_USER_PASSWORD
	});
	await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE}\`;`);

	sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_USER_PASSWORD, {
		dialect: 'mysql',
		dialectModule: mysql,
		omitNull: true,
		logging: false
	});

	initOrganizationModel(sequelize);
	initUserModel(sequelize);
	initApplicationCommentModel(sequelize);
	initApplicationInternalCommentModel(sequelize);
	initApplicationFileModel(sequelize);
	initApplicationInternalFileModel(sequelize);
	initApplicationModel(sequelize);
	initApplicationInternalModel(sequelize);
	initFileModel(sequelize);
	initCommentsModel(sequelize);
	initApplicationLaborCostsModel(sequelize);
	initKindsOfWorkModel(sequelize);
	initLaborCostsModel(sequelize);
    initOrganizationModelRelations();

	if (process.env.NODE_ENV === 'development') {
		const organization = await createDefaultOrganization();
		await createDefaultUser(organization);
	}

	return models;
};
