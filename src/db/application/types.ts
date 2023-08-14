import { Optional } from 'sequelize';

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
	isUrgent: boolean;
	isArchived: boolean;
};

export interface ApplicationAttributesCreation
	extends Optional<ApplicationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deadline'> {}
