import { Optional } from 'sequelize';

export type FileAttributes = {
	id: number;
	createdAt: string;
	updatedAt: string;
	name: string;
	type: string;
	applicationId: number;
};

export interface FileAttributesCreation extends Optional<FileAttributes, 'id' | 'createdAt' | 'updatedAt'> {}
