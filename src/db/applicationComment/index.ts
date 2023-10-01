import { Sequelize } from 'sequelize';
import { applicationCommentSchema } from './schema';
import { ApplicationCommentModel } from './model';

export const initApplicationCommentModel = (sequelize: Sequelize) => {
	ApplicationCommentModel.init(applicationCommentSchema, {
		sequelize,
		modelName: 'application_comments',
		timestamps: false
	});
};
