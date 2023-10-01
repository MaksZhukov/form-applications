import mysql from 'mysql2';
import mysqlPromise from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import { applicationSchema } from './application/schema';
import { fileSchema } from './file/schema';
import { organizationSchema } from './organization/schema';

import { ApplicationModel } from './application/model';
import { CommentModel } from './comment/model';
import { commentSchema } from './comment/schema';
import { OrganizationModel } from './organization/model';
import { FileModel } from './file/model';
import { ApplicationCommentModel } from './applicationComment/model';
import { applicationCommentSchema } from './applicationComment/schema';
import { UserModel } from './users/model';
import { userSchema } from './users/schema';
import { ApplicationFileModel } from './applicationFiles/model';
import { applicationFileSchema } from './applicationFiles/schema';
import { ApplicationInternalModel } from './applicationInternal/model';
import { applicationInternalSchema } from './applicationInternal/schema';
import { ApplicationInternalFileModel } from './applicationInternalFiles/model';
import { ApplicationInternalCommentModel } from './applicationInternalComments/model';
import { applicationInternalCommentSchema } from './applicationInternalComments/schema';
import { initComments } from './comment';
import { initFileModel } from './file';
import { createDefaultOrganization } from './organization/default';
import { createDefaultUser } from './users/default';
import { initUserModel } from './users';
import { initOrganizationModel } from './organization';
import { initApplicationCommentModel } from './applicationComment';
import { initApplicationInternalCommentModel } from './applicationInternalComments';
import { initApplicationFileModel } from './applicationFiles';
import { initApplicationInternalFileModel } from './applicationInternalFiles';
import { initApplicationModel } from './application';
import { initApplicationInternalModel } from './applicationInternal';

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
	ApplicationInternalFileModel
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
	initComments(sequelize);

	try {
		await sequelize.sync({ alter: true });
	} catch (err) {}

	if (process.env.NODE_ENV === 'development') {
		const organization = await createDefaultOrganization();
		await createDefaultUser(organization);
	}

	return models;
};
