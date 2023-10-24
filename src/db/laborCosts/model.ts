import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin, Model } from 'sequelize';
import { LaborCostsAttributes, LaborCostsAttributesCreation } from './types';

export class LaborCostsModel extends Model<LaborCostsAttributes, LaborCostsAttributesCreation> {}
