import { API_LIMIT_ITEMS } from '@/constants';
import { getTemplateEqual, getTemplateValues } from '../config';
import executeQuery from '../db';
import { UserRole } from '../users/types';
import { Application, ApplicationStatus } from './types';

export const getApplications = async (
	{
		userId,
		userRole,
		status,
		organization_name
	}: { userId: number; userRole: UserRole; status?: ApplicationStatus; organization_name?: string },
	{ limit = API_LIMIT_ITEMS, offset = 0 }: { limit: number; offset: number }
) => {
	let filters: any = {};
	if (status) {
		filters.status = status;
	}
	if (organization_name) {
		filters.organization_name = organization_name;
	}
	const [data, meta] = await Promise.all([
		executeQuery<Application[]>({
			query: `SELECT applications.id, applications.date, applications.title, applications.description, applications.deadline, applications.status, users.uid, users.organization_name FROM applications LEFT JOIN users ON users.id = applications.user_id ${
				userRole === 'admin'
					? `${Object.keys(filters).length ? `where ${getTemplateEqual(filters)}` : ''}`
					: 'where user_id=?'
			} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
			values: userRole === 'admin' ? getTemplateValues(filters) : [`${userId}`]
		}),
		executeQuery<[{ total: number }]>({
			query: `SELECT COUNT(*) AS total FROM applications ${
				userRole === 'admin'
					? `${Object.keys(filters).length ? `where ${getTemplateEqual(filters)}` : ''}`
					: 'where user_id=?'
			}`,
			values: userRole === 'admin' ? getTemplateValues(filters) : [`${userId}`]
		})
	]);
	const total = Array.isArray(meta) ? meta[0].total : 0;
	return { data, meta: { total, offset, limit } };
};

export const getApplication = async (id: number, userId: number, userRole: UserRole) => {
	const data = await executeQuery<Application[]>({
		query: `SELECT applications.id, applications.date, applications.title, applications.description, applications.deadline, applications.status,applications.name, applications.phone,applications.email, users.uid, users.organization_name FROM applications LEFT JOIN users ON users.id = applications.user_id where applications.id=? ${
			userRole === 'admin' ? '' : 'and user_id=?'
		}`,
		values: userRole === 'admin' ? [`${id}`] : [`${id}`, `${userId}`]
	});

	return Array.isArray(data) ? data[0] : null;
};

export const getNewApplicationId = () => {
	return executeQuery({ query: 'SELECT id from applications ORDER BY id DESC LIMIT 1', values: [] });
};

export const createApplication = async (data: Omit<Application, 'id' | 'created_at'>) => {
	return executeQuery({
		query: 'INSERT INTO applications(title,description,date,deadline,phone,comment,status,name,email,user_id) VALUES(?,?,?,?,?,?,?,?,?,?)',
		values: getTemplateValues(data)
	});
};

export const updateApplication = async (id: number, data: Partial<Application>) => {
	return executeQuery({
		query: `UPDATE applications SET ${getTemplateEqual(data, ',')} where id=${id}`,
		values: getTemplateValues(data)
	});
};
