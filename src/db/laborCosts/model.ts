import { BelongsToManyAddAssociationMixin, Model } from 'sequelize';
import { LaborCostsAttributes, LaborCostsAttributesCreation } from './types';

export class LaborCostsModel extends Model<LaborCostsAttributes, LaborCostsAttributesCreation> {
	// declare addComment: BelongsToManyAddAssociationMixin<CommentModel, number>;
	// declare getComments: BelongsToManyGetAssociationsMixin<CommentModel>;
	// declare getFiles: BelongsToManyGetAssociationsMixin<FileModel>;
	// declare addFiles: BelongsToManyAddAssociationsMixin<FileModel, number>;
}
