import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, Model } from 'sequelize';
import { ApplicationAttributes, ApplicationAttributesCreation } from './types';
import { CommentModel } from '../comment/model';

export class ApplicationModel extends Model<ApplicationAttributes, ApplicationAttributesCreation> {
	public readonly comments?: CommentModel[];
	declare addComment: BelongsToManyAddAssociationMixin<CommentModel, number>;
	declare getComments: BelongsToManyGetAssociationsMixin<CommentModel>;
}
