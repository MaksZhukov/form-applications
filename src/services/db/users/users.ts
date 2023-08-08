import { getTemplateEqual, getTemplateValues } from '../config';
import executeQuery from '../db';
import { User, UserRole } from './types';

export const getUser = async (data: { [key: string]: string | number }) => {
	const res = await executeQuery<User[]>({
		query: `SELECT * FROM users where ${getTemplateEqual(data)}`,
		values: getTemplateValues(data)
	});
	return Array.isArray(res) ? res[0] : null;
};

export const createUser = async (data: { email: string; password: string; role: UserRole }) => {
	return executeQuery({
		query: `INSERT INTO users(email, password, role) VALUES('${data.email}', '${data.password}', '${data.role}')`,
		values: getTemplateValues(data)
	});
};

export const updateUser = async (id: number, data: { [key: string]: string | number }) => {
	const res = await executeQuery({
		query: `UPDATE users SET ${getTemplateEqual(data)} where id=?`,
		values: [...getTemplateValues(data), `${id}`]
	});
	return res;
};
