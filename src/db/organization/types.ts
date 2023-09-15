import { Optional } from 'sequelize';

export type Role = 'admin' | 'regular';

export type OrganizationAttributes = {
	id: number;
	name: string;
	uid: string;
	createdAt: string;
	updatedAt: string;
};

export interface OrganizationAttributesCreation
	extends Optional<OrganizationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
