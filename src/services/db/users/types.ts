export type UserRole = 'admin' | 'regular';

export type User = {
	id: number;
	email: string;
	password: string;
	role: UserRole;
	token: string;
	organization_name: string;
	uid: string;
};
