import { OrganizationAttributes } from '@/db/organization/types';
import client from '../client';
import { ApiResponse } from '../types';
import { UserAttributes } from '@/db/users/types';

export type UserAPI = Pick<
	UserAttributes,
	'id' | 'name' | 'departmentName' | 'email' | 'role' | 'isActive' | 'phone'
> & {
	organization: Omit<OrganizationAttributes, 'responsibleUser'> & {
		responsibleUser: Pick<UserAttributes, 'id' | 'name'>;
	};
};

export const fetchUsers = (data: {
	organizationId?: number;
	isActive?: boolean;
	onlyCustomers?: boolean;
	offset?: number;
	search?: string;
}) =>
	client
		.get<ApiResponse<UserAPI[]>>(`/api/users`, {
			params: data
		})
		.then((res) => res.data);

export const createUser = (data: FormData) =>
	client.post<ApiResponse<Pick<UserAttributes, 'id' | 'name'>[]>>(`/api/users`, data);

export const updateUser = ({ data, id }: { id: number; data: FormData }) =>
	client.put<ApiResponse<Pick<UserAttributes, 'id' | 'name'>[]>>(`/api/users/${id}`, data);

export const deleteUser = (id: number) =>
	client.delete<ApiResponse<Pick<UserAttributes, 'id' | 'name'>[]>>(`/api/users/${id}`);
