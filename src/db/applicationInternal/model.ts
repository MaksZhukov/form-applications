import {
	BelongsToManyAddAssociationMixin,
	BelongsToManyAddAssociationsMixin,
	BelongsToManyGetAssociationsMixin,
	Model
} from 'sequelize';
import { ApplicationInternalAttributes, ApplicationInternalAttributesCreation } from './types';
import { CommentModel } from '../comment/model';
import { FileModel } from '../file/model';

export class ApplicationInternalModel extends Model<
	ApplicationInternalAttributes,
	ApplicationInternalAttributesCreation
> {
	public readonly comments?: CommentModel[];
	declare addComment: BelongsToManyAddAssociationMixin<CommentModel, number>;
	declare getComments: BelongsToManyGetAssociationsMixin<CommentModel>;
	declare getFiles: BelongsToManyGetAssociationsMixin<FileModel>;
	declare addFiles: BelongsToManyAddAssociationsMixin<FileModel, number>;
}
