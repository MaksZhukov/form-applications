import mysql from 'mysql2';
import mysqlPromise from 'mysql2/promise';
import { Model, ModelStatic, Sequelize } from 'sequelize';
import { applicationSchema } from './application/schema';
import { ApplicationAttributes, ApplicationAttributesCreation } from './application/types';
import { fileSchema } from './files/schema';
import { FileAttributes, FileAttributesCreation } from './files/types';
import { organizationSchema } from './organization/schema';
import { OrganizationAttributes, OrganizationAttributesCreation } from './organization/types';
import { CommentAttributes, CommentAttributesCreation } from './comments/types';
import { commentSchema } from './comments/schema';

let OrganizationModel: ModelStatic<Model<OrganizationAttributes, OrganizationAttributesCreation>>;
let ApplicationModel: ModelStatic<Model<ApplicationAttributes, ApplicationAttributesCreation>>;
let FileModel: ModelStatic<Model<FileAttributes, FileAttributesCreation>>;
let CommentModel: ModelStatic<Model<CommentAttributes, CommentAttributesCreation>>;

let sequelize: Sequelize;
export const initialize = async () => {
	if (sequelize) {
		return { OrganizationModel, ApplicationModel, FileModel, CommentModel };
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

	OrganizationModel = sequelize.define<Model<OrganizationAttributes, OrganizationAttributesCreation>>(
		'organization',
		organizationSchema
	);

	ApplicationModel = sequelize.define<Model<ApplicationAttributes, ApplicationAttributesCreation>>(
		'application',
		applicationSchema
	);
	ApplicationModel.belongsTo(OrganizationModel);

	FileModel = sequelize.define<Model<FileAttributes, FileAttributesCreation>>('file', fileSchema);
	// await ApplicationModel.update({ deadline: '12.12.2012' }, { where: { id: 22 } });
	FileModel.belongsTo(ApplicationModel);

	CommentModel = sequelize.define<Model<CommentAttributes, CommentAttributesCreation>>('comment', commentSchema);

	CommentModel.belongsTo(OrganizationModel);
	CommentModel.belongsTo(ApplicationModel);

	await CommentModel.sync({ alter: true });
	return { OrganizationModel, ApplicationModel, FileModel };
};
