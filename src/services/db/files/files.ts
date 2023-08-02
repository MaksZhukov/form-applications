import executeQuery from '../db';
import { File } from './types';

export const createFiles = async (data: Omit<File, 'id'>[]) => {
	return executeQuery({
		query: `INSERT INTO files(name,type) VALUES${data.map((item) => `('${item.name}','${item.type}')`)}`,
		values: []
	});
};

export const getFilesByApplicationID = async (applicationIDs: number[]) => {
	return executeQuery({
		query: `SELECT files.id, files.name, files.type, application_id FROM files LEFT JOIN applications_files ON files.id = applications_files.file_id WHERE application_id in (${applicationIDs});`,
		values: []
	});
};
