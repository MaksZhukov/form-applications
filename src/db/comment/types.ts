import { Optional } from 'sequelize';

export type CommentAttributes = {
	id: number;
	createdAt: string;
	updatedAt: string;
	text: string;
	applicationId: number;
	organizationId: number;
};

export interface CommentAttributesCreation extends Optional<CommentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}