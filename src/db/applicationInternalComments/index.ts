import { Sequelize } from 'sequelize';
import { ApplicationInternalCommentModel } from './model';
import { applicationInternalCommentSchema } from './schema';

export const initApplicationInternalCommentModel = async (sequelize: Sequelize) => {
	ApplicationInternalCommentModel.init(applicationInternalCommentSchema, {
		sequelize,
		modelName: 'application_internal_comments',
		timestamps: false
	});
};
