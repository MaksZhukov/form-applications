import { BelongsToManyAddAssociationMixin, Model } from 'sequelize';
import { ApplicationInternalFileAttributes } from './types';
import { CommentModel } from '../comment/model';

export class ApplicationInternalFileModel extends Model<ApplicationInternalFileAttributes> {}
