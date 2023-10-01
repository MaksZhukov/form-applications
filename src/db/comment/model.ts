import { BelongsToManyAddAssociationMixin, Model } from 'sequelize';
import { CommentAttributes, CommentAttributesCreation } from './types';
import { ApplicationModel } from '../application/model';
import { ApplicationInternalModel } from '../applicationInternal/model';

export class CommentModel extends Model<CommentAttributes, CommentAttributesCreation> {
	declare addApplication: BelongsToManyAddAssociationMixin<ApplicationModel, number>;
	declare addInternalApplication: BelongsToManyAddAssociationMixin<ApplicationInternalModel, number>;
}
