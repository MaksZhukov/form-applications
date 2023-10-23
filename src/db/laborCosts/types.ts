import { Optional } from 'sequelize';
import { UserAttributes } from '../users/types';

export type LaborCostsAttributes = {
	id: number;
	createdAt: string;
	updatedAt: string;
	date: string;
	timeSpent: string;
	employeeId: number;
	kindOfWorkId: number;
};

export interface LaborCostsAttributesCreation
	extends Optional<LaborCostsAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
