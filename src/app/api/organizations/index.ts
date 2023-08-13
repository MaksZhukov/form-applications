import { OrganizationAttributes } from '@/db/organization/types';
import client from '../client';
import { ApiResponse } from '../types';

export const fetchOrganizations = () =>
	client.get<ApiResponse<Pick<OrganizationAttributes, 'id' | 'name'>[]>>(`/api/organizations`);

export const createOrganization = (data: FormData) =>
	client.post<ApiResponse<Pick<OrganizationAttributes, 'id' | 'name'>[]>>(`/api/organizations`, data);
