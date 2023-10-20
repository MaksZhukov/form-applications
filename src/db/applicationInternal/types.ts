import { Optional } from 'sequelize';
import { ApplicationStatus } from '../application/types';
import { OrganizationAttributes } from '../organization/types';
import { UserAttributes } from '../users/types';

export type ApplicationInternalAttributes = {
	id: number;
	createdAt: string;
	updatedAt: string;
	title: string;
	employee: string;
	responsibleUserId: number;
    responsibleUser?: UserAttributes;
	description: string;
	deadline: string;
	departmentName: string;
	comment: string;
	status: ApplicationStatus;
	organizationId: number;
	organization: OrganizationAttributes;
	isUrgent: boolean;
	isArchived: boolean;
};

export interface ApplicationInternalAttributesCreation
	extends Optional<ApplicationInternalAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deadline'> {}
