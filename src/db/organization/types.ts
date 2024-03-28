import { Optional } from 'sequelize';
import { UserAttributes } from '../users/types';

export type Role = 'admin' | 'regular';

export type OrganizationAttributes = {
	id: number;
	name: string;
	uid: string;
	address: string;
	createdAt: string;
	updatedAt: string;
	responsibleUserId?: number;
	responsibleUser?: UserAttributes;
};

export interface OrganizationAttributesCreation
	extends Optional<OrganizationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
