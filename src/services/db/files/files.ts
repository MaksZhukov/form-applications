import executeQuery from '../db';

export const createFiles = async (applicationId: string, names: string[]) => {
	return executeQuery({
		query: `INSERT INTO files(application_id,name) VALUES${names.map(
			(item, index) => `('${applicationId}','${item}')`
		)}`,
		values: names
	});
};

export const getFiles = async (applicationIDs: number[]) => {
	return executeQuery({
		query: `SELECT * FROM files WHERE application_id in (${applicationIDs});`,
		values: []
	});
};
