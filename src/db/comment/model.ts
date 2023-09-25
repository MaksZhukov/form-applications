import { BelongsTo, BelongsToManyAddAssociationMixin, Model } from 'sequelize';
import { CommentAttributes, CommentAttributesCreation } from './types';
import { ApplicationModel } from '../application/model';
import { UserModel } from '../users/model';

export class CommentModel extends Model<CommentAttributes, CommentAttributesCreation> {
	declare addApplication: BelongsToManyAddAssociationMixin<ApplicationModel, number>;
}
