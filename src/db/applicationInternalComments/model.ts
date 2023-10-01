import { BelongsToManyAddAssociationMixin, Model } from 'sequelize';
import { ApplicationInternalCommentAttributes } from './types';
import { CommentModel } from '../comment/model';

export class ApplicationInternalCommentModel extends Model<ApplicationInternalCommentAttributes> {}
