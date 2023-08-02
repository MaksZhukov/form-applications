import executeQuery from '../db';

export const createApplicationsFiles = async (applicationId: number, filesIDs: number[]) => {
	return executeQuery({
		query: `INSERT INTO applications_files(application_id, file_id) VALUES${filesIDs.map(
			(id) => `(${applicationId}, ${id})`
		)}`,
		values: []
	});
};
