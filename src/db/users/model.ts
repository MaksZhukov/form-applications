import { Model } from 'sequelize';
import { UserAttributesCreation, UserAttributes } from './types';

export class UserModel extends Model<UserAttributes, UserAttributesCreation> {}
