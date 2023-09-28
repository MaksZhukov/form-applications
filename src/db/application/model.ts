import {
	BelongsToManyAddAssociationMixin,
	BelongsToManyAddAssociationsMixin,
	BelongsToManyGetAssociationsMixin,
	Model
} from 'sequelize';
import { ApplicationAttributes, ApplicationAttributesCreation } from './types';
import { CommentModel } from '../comment/model';
import { FileModel } from '../file/model';

export class ApplicationModel extends Model<ApplicationAttributes, ApplicationAttributesCreation> {
	public readonly comments?: CommentModel[];
	declare addComment: BelongsToManyAddAssociationMixin<CommentModel, number>;
	declare getComments: BelongsToManyGetAssociationsMixin<CommentModel>;
	declare getFiles: BelongsToManyGetAssociationsMixin<FileModel>;
	declare addFiles: BelongsToManyAddAssociationsMixin<FileModel, number>;
}
