import {
	BelongsToManyAddAssociationMixin,
	BelongsToManyAddAssociationsMixin,
	BelongsToManyGetAssociationsMixin,
	Model
} from 'sequelize';
import { ApplicationAttributes, ApplicationAttributesCreation } from './types';
import { CommentModel } from '../comment/model';
import { FileModel } from '../file/model';
import { LaborCostsModel } from '../laborCosts/model';

export class ApplicationModel extends Model<ApplicationAttributes, ApplicationAttributesCreation> {
	public readonly comments?: CommentModel[];
	declare addComment: BelongsToManyAddAssociationMixin<CommentModel, number>;
	declare getComments: BelongsToManyGetAssociationsMixin<CommentModel>;
	declare getFiles: BelongsToManyGetAssociationsMixin<FileModel>;
	declare addFiles: BelongsToManyAddAssociationsMixin<FileModel, number>;
	declare getLaborCosts: BelongsToManyGetAssociationsMixin<LaborCostsModel>;
    declare addLaborCosts: BelongsToManyAddAssociationsMixin<LaborCostsModel, number>;
}
