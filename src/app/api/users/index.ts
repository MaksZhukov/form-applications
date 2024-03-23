import client from '../client';
import { ApiResponse } from '../types';
import { UserAttributes } from '@/db/users/types';

export const fetchUsers = (data: { organizationId: number; isActive?: boolean }) =>
	client.get<ApiResponse<Pick<UserAttributes, 'id' | 'name' | 'departmentName'>[]>>(`/api/users`, { params: data });

export const createUser = (data: FormData) =>
	client.post<ApiResponse<Pick<UserAttributes, 'id' | 'name'>[]>>(`/api/users`, data);

export const updateUser = (data: FormData) =>
	client.post<ApiResponse<Pick<UserAttributes, 'id' | 'name'>[]>>(`/api/users`, data);

export const deleteUser = (id: number) =>
	client.delete<ApiResponse<Pick<UserAttributes, 'id' | 'name'>[]>>(`/api/users/${id}`);
