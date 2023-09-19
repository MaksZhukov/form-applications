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

let sequelize: Sequelize;
export const initialize = async () => {
	if (sequelize) {
		return { OrganizationModel, ApplicationModel, FileModel, CommentModel, UserModel };
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
		omitNull: true
	});

	OrganizationModel.init(organizationSchema, { sequelize, modelName: 'organization' });

	UserModel.init(userSchema, { sequelize, modelName: 'user' });
	UserModel.belongsTo(OrganizationModel);

	ApplicationCommentModel.init(applicationCommentSchema, {
		sequelize,
		modelName: 'application_comments',
		timestamps: false
	});

	ApplicationModel.init(applicationSchema, { sequelize, modelName: 'application' });
	ApplicationModel.belongsTo(OrganizationModel);

	FileModel.init(fileSchema, { sequelize, modelName: 'file' });
	FileModel.belongsTo(ApplicationModel);

	CommentModel.init(commentSchema, { sequelize, modelName: 'comment' });
	CommentModel.belongsTo(UserModel);
	CommentModel.belongsToMany(ApplicationModel, { through: ApplicationCommentModel });
	ApplicationModel.belongsToMany(CommentModel, { through: ApplicationCommentModel });
	// await sequelize.sync({ alter: true });

	if (process.env.NODE_ENV === 'development') {
		const [organization] = await OrganizationModel.findOrCreate({
			where: { name: 'admin' },
			defaults: { name: 'Admin', uid: 'uidadmin' }
		});
		await UserModel.findOrCreate({
			where: { email: 'admin@mail.ru' },
			defaults: {
				email: 'admin@mail.ru',
				name: 'admin',
				organizationId: organization.dataValues.id,
				password: await bcrypt.hash('admin', +process.env.BCRYPT_SALT),
				role: 'admin'
			}
		});
	}

	return { OrganizationModel, ApplicationModel, FileModel, CommentModel, UserModel };
};
