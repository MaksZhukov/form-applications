import { Optional } from 'sequelize';
import { UserAttributes } from '../users/types';
import { OrganizationAttributes } from '../organization/types';

export type ApplicationStatus = 'в обработке' | 'в работе' | 'выполнено';

export type ApplicationAttributes = {
	id: number;
	createdAt: string;
	updatedAt: string;
	title: string;
	description: string;
	deadline: string;
	phone: string;
	name: string;
	comment: string;
	status: ApplicationStatus;
	email: string;
	organizationId: number;
	organization: OrganizationAttributes;
	isUrgent: boolean;
	isArchived: boolean;
	responsibleUserId: number;
	responsibleUser?: UserAttributes;
};

export interface ApplicationAttributesCreation
	extends Optional<ApplicationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deadline'> {}
