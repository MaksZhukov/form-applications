import { Optional } from 'sequelize';
import { UserAttributes } from '../users/types';

export type Role = 'admin' | 'regular';

export type OrganizationAttributes = {
	id: number;
	name: string;
	uid: string;
	address: string;
	phone: string;
	email: string;
	createdAt: string;
	updatedAt: string;
	responsibleUserId?: number | null;
	responsibleUser?: UserAttributes;
};

export interface OrganizationAttributesCreation
	extends Optional<
		OrganizationAttributes,
		'id' | 'createdAt' | 'updatedAt' | 'responsibleUser' | 'responsibleUserId' | 'email' | 'phone'
	> {}
