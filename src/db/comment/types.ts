import { Optional } from 'sequelize';
import { UserAttributes } from '../users/types';

export type CommentAttributes = {
	id: number;
	createdAt: string;
	updatedAt: string;
	text: string;
	userId: number;
	user: UserAttributes;
};

export interface CommentAttributesCreation
	extends Optional<CommentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'user'> {}
