import { OrganizationAttributes } from '@/db/organization/types';
import client from '../client';
import { ApiResponse } from '../types';

export const fetchOrganizations = () =>
	client.get<ApiResponse<Pick<OrganizationAttributes, 'id' | 'name' | 'address' | 'createdAt'>[]>>(
		`/api/organizations`
	);

export const createOrganization = (data: FormData) =>
	client.post<ApiResponse<Pick<OrganizationAttributes, 'id' | 'name' | 'address'>[]>>(`/api/organizations`, data);

export const updateOrganization = ({ id, data }: { id: number; data: FormData }) =>
	client.put<ApiResponse<Pick<OrganizationAttributes, 'id' | 'name' | 'address'>[]>>(
		`/api/organizations/${id}`,
		data
	);
