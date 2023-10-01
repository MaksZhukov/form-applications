import { Optional } from 'sequelize';
import { ApplicationStatus } from '../application/types';

export type ApplicationInternalAttributes = {
	id: number;
	createdAt: string;
	updatedAt: string;
	title: string;
	forWhom: string;
	description: string;
	deadline: string;
	departmentName: string;
	comment: string;
	status: ApplicationStatus;
	redirection: string;
	organizationId: number;
	isUrgent: boolean;
	isArchived: boolean;
};

export interface ApplicationInternalAttributesCreation
	extends Optional<ApplicationInternalAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deadline'> {}
