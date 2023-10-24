import { Optional } from 'sequelize';
import { UserAttributes } from '../users/types';
import { KindsOfWorkAttributes } from '../kindsOfWork/types';

export type LaborCostsAttributes = {
	id: number;
	createdAt: string;
	updatedAt: string;
	date: string;
	timeSpent: string;
	employee: UserAttributes;
	employeeId: number;
	kindsOfWorkId: number;
	kindsOfWork: KindsOfWorkAttributes;
	description: string;
};

export interface LaborCostsAttributesCreation
	extends Optional<LaborCostsAttributes, 'id' | 'createdAt' | 'updatedAt' | 'employee' | 'kindsOfWork'> {}
