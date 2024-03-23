import { Optional } from 'sequelize';

export type Role = 'admin' | 'regular';

export type UserAttributes = {
	id: number;
	name: string;
	email: string;
	password: string;
	token: string;
	role: Role;
	departmentName: string;
	organizationId: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
};

export interface UserAttributesCreation
	extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'token' | 'isActive'> {}
