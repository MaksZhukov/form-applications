import { BelongsToManyAddAssociationMixin, Model } from 'sequelize';
import { ApplicationFileAttributes } from './types';
import { CommentModel } from '../comment/model';

export class ApplicationFileModel extends Model<ApplicationFileAttributes> {}
