import { Role } from './db/users/types';

export type Method = 'GET' | 'POST' | 'PUT';

export const authPathsByRole: Record<Role, { path: string; methods: Method[] }[]> = {
	regular: [
		{ path: '/api/applications', methods: ['GET', 'PUT', 'POST'] },
		{ path: '/api/applications/new', methods: ['GET'] },
		{ path: '/api/applications/:id', methods: ['GET', 'PUT', 'POST'] },
		{ path: '/api/organization', methods: ['GET'] },
		{ path: '/api/organizations', methods: ['GET'] },
		{ path: '/api/user', methods: ['GET'] },
		{ path: '/api/users', methods: ['GET'] },
		{ path: '/api/files', methods: ['GET', 'POST'] },
		{ path: '/api/files/:name', methods: ['GET'] },
		{ path: '/api/comments', methods: ['GET'] },
		{ path: '/api/socket', methods: ['GET'] },
		{ path: '/api/logout', methods: ['POST'] }
	],
	admin: [
		{ path: '/api/applications', methods: ['GET', 'PUT', 'POST'] },
		{ path: '/api/applications/new', methods: ['GET'] },
		{ path: '/api/applications/:id', methods: ['GET', 'PUT', 'POST'] },
		{ path: '/api/organization', methods: ['GET', 'PUT', 'POST'] },
		{ path: '/api/organizations', methods: ['GET', 'PUT', 'POST'] },
		{ path: '/api/user', methods: ['GET', 'PUT', 'POST'] },
		{ path: '/api/users', methods: ['GET', 'PUT', 'POST'] },
		{ path: '/api/files', methods: ['GET', 'POST'] },
		{ path: '/api/files/:name', methods: ['GET'] },
		{ path: '/api/comments', methods: ['GET'] },
		{ path: '/api/socket', methods: ['GET', 'PUT', 'POST'] },
		{ path: '/api/logout', methods: ['POST'] }
	]
};

export const publicPaths = ['/api/login'];

export const redirectAuthPaths = ['/login'];
