import client from '../client';
import { ApiResponse } from '../types';
import { UserAttributes } from '@/db/users/types';

export const fetchUsers = (data: { organizationId: number }) =>
	client.get<ApiResponse<Pick<UserAttributes, 'id' | 'name'>[]>>(`/api/users`, { params: data });

export const createUser = (data: FormData) =>
	client.post<ApiResponse<Pick<UserAttributes, 'id' | 'name'>[]>>(`/api/users`, data);
