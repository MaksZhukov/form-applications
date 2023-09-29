import mysql from 'mysql2';
import mysqlPromise from 'mysql2/promise';
import { BelongsToManyAddAssociationMixin, DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';
import { applicationSchema } from './application/schema';
import { fileSchema } from './file/schema';
import { organizationSchema } from './organization/schema';
import bcrypt from 'bcrypt';
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

	OrganizationModel.init(organizationSchema, { sequelize, modelName: 'organization' });

	UserModel.init(userSchema, { sequelize, modelName: 'user' });
	UserModel.belongsTo(OrganizationModel);

	ApplicationCommentModel.init(applicationCommentSchema, {
		sequelize,
		modelName: 'application_comments',
		timestamps: false
	});

	ApplicationInternalCommentModel.init(applicationInternalCommentSchema, {
		sequelize,
		modelName: 'application_internal_comments',
		timestamps: false
	});

	ApplicationFileModel.init(applicationFileSchema, { sequelize, modelName: 'application_files', timestamps: false });
	ApplicationInternalFileModel.init(applicationInternalSchema, {
		sequelize,
		modelName: 'application_internal_files',
		timestamps: false
	});

	ApplicationModel.init(applicationSchema, { sequelize, modelName: 'application' });
	ApplicationModel.belongsTo(OrganizationModel);

	ApplicationInternalModel.init(applicationInternalSchema, { sequelize, modelName: 'application_internal' });

	FileModel.init(fileSchema, { sequelize, modelName: 'file' });
	FileModel.belongsToMany(ApplicationModel, { through: ApplicationFileModel, onDelete: 'CASCADE' });
	ApplicationModel.belongsToMany(FileModel, { through: ApplicationFileModel, onDelete: 'CASCADE' });

	FileModel.belongsToMany(ApplicationInternalModel, { through: ApplicationInternalFileModel, onDelete: 'CASCADE' });
	ApplicationInternalModel.belongsToMany(FileModel, { through: ApplicationInternalFileModel, onDelete: 'CASCADE' });

	CommentModel.init(commentSchema, { sequelize, modelName: 'comment' });
	CommentModel.belongsTo(UserModel);
	CommentModel.belongsToMany(ApplicationModel, { through: ApplicationCommentModel, onDelete: 'CASCADE' });
	ApplicationModel.belongsToMany(CommentModel, { through: ApplicationCommentModel, onDelete: 'CASCADE' });

	CommentModel.belongsToMany(ApplicationInternalModel, {
		through: ApplicationInternalCommentModel,
		onDelete: 'CASCADE'
	});
	ApplicationInternalModel.belongsToMany(CommentModel, {
		through: ApplicationInternalCommentModel,
		onDelete: 'CASCADE'
	});

	await sequelize.sync({ alter: true });

	if (process.env.NODE_ENV === 'development') {
		const [organization] = await OrganizationModel.findOrCreate({
			where: { name: 'Default' },
			defaults: { name: 'Default', uid: '000000000' }
		});
		await UserModel.findOrCreate({
			where: { email: 'admin@mail.ru' },
			defaults: {
				email: 'admin@mail.ru',
				name: 'admin',
				organizationId: organization.dataValues.id,
				password: await bcrypt.hash(process.env.DEFAULT_USER_ADMIN_PASS, +process.env.BCRYPT_SALT),
				role: 'admin'
			}
		});
	}

	return models;
};
