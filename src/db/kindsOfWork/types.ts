import { Optional } from 'sequelize';
import { UserAttributes } from '../users/types';

export type KindsOfWorkAttributes = {
	id: number;
	createdAt: string;
	updatedAt: string;
	name: string;
};

export interface KindsOfWorkAttributesCreation
	extends Optional<KindsOfWorkAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
