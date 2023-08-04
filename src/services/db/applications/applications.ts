import { API_LIMIT_ITEMS } from '@/constants';
import { getTemplateValues } from '../config';
import executeQuery from '../db';
import { UserRole } from '../users/types';
import { Application } from './types';

export const getApplications = async (
	{ userId, userRole }: { userId: number; userRole: UserRole },
	{ limit = API_LIMIT_ITEMS, offset = 0 }: { limit: number; offset: number }
) => {
	const [data, meta] = await Promise.all([
		executeQuery<Application[]>({
			query: `SELECT id, date, title, description, deadline, phone, comment, status, name, email FROM applications ${
				userRole === 'admin' ? '' : 'where user_id=?'
			} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
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

export const createApplication = async (data: Omit<Application, 'id' | 'created_at'>) => {
	return executeQuery({
		query: 'INSERT INTO applications(title,description,date,deadline,phone,comment,status,name,email,user_id) VALUES(?,?,?,?,?,?,?,?,?,?)',
		values: getTemplateValues(data)
	});
};
