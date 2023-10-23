import { Sequelize } from 'sequelize';
import { CommentModel } from './model';
import { commentSchema } from './schema';
import { UserModel } from '../users/model';
import { ApplicationCommentModel } from '../applicationComment/model';
import { ApplicationModel } from '../application/model';
import { ApplicationInternalModel } from '../applicationInternal/model';
import { ApplicationInternalCommentModel } from '../applicationInternalComments/model';

export const initCommentsModel = async (sequelize: Sequelize) => {
	CommentModel.init(commentSchema, { sequelize, modelName: 'comment' });
	CommentModel.belongsTo(UserModel, { constraints: false, foreignKey: 'userId' });
	CommentModel.belongsToMany(ApplicationModel, {
		through: ApplicationCommentModel,
		onDelete: 'CASCADE'
	});
	ApplicationModel.belongsToMany(CommentModel, {
		through: ApplicationCommentModel,
		onDelete: 'CASCADE'
	});
	CommentModel.belongsToMany(ApplicationInternalModel, {
		through: ApplicationInternalCommentModel,
		onDelete: 'CASCADE'
	});
	ApplicationInternalModel.belongsToMany(CommentModel, {
		through: ApplicationInternalCommentModel,
		onDelete: 'CASCADE'
	});
};
