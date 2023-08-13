import { Optional } from 'sequelize';

export type Role = 'admin' | 'regular';

export type OrganizationAttributes = {
	id: number;
	name: string;
	uid: string;
	email: string;
	password: string;
	token: string;
	role: Role;
	createdAt: string;
	updatedAt: string;
};

export interface OrganizationAttributesCreation
	extends Optional<OrganizationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'token'> {}
