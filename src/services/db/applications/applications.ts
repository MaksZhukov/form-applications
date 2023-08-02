import { getTemplateValues } from '../config';
import executeQuery from '../db';
import { UserRole } from '../users/types';
import { Application } from './types';

export const getApplications = async (
	{ userId, userRole }: { userId: number; userRole: UserRole },
	{ limit = 25, offset = 0 }: { limit: number; offset: number }
) => {
	const [data, meta] = await Promise.all([
		executeQuery<Application[]>({
			query: `SELECT id, date, title, description, deadline, phone, comment FROM applications ${
				userRole === 'admin' ? '' : 'where user_id=?'
			} LIMIT ${limit} OFFSET ${offset}`,
			values: userRole === 'admin' ? [] : [`${userId}`]
		}),
		executeQuery<[{ total: number }]>({
			query: `SELECT COUNT(*) AS total FROM applications ${userRole === 'admin' ? '' : 'where user_id=?'}`,
			values: userRole === 'admin' ? [] : [`${userId}`]
		})
	]);
	const total = Array.isArray(meta) ? meta[0].total : 0;
	return { data, meta: { total, offset, limit } };
};

export const createApplication = async (data: Omit<Application, 'id'>) => {
	return executeQuery({
		query: 'INSERT INTO applications(title,description,date,deadline,phone,comment,user_id) VALUES(?,?,?,?,?,?,?)',
		values: getTemplateValues(data)
	});
};
