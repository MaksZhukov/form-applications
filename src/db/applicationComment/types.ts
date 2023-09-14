import { Optional } from 'sequelize';

export type ApplicationStatus = 'в обработке' | 'в работе' | 'выполнено';

export type ApplicationCommentAttributes = {
	id: number;
	applicationId: number;
	commenId: number;
};

