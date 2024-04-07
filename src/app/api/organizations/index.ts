import { OrganizationAttributes } from '@/db/organization/types';
import client from '../client';
import { ApiResponse } from '../types';
import { UserAttributes } from '@/db/users/types';
import { API_MAX_LIMIT_ITEMS } from '@/constants';

export type Organization = Pick<
	OrganizationAttributes,
	'id' | 'name' | 'address' | 'createdAt' | 'uid' | 'responsibleUserId' | 'email' | 'phone'
> & {
	responsibleUser?: Pick<UserAttributes, 'id' | 'name'>;
};

export const fetchOrganizations = (data?: { search: string; offset: number; limit: number }) =>
	client
		.get<ApiResponse<Organization[]>>(`/api/organizations`, {
			params: { search: data?.search, offset: data?.offset, limit: data?.limit || API_MAX_LIMIT_ITEMS }
		})
		.then((data) => data.data);

export const createOrganization = (data: FormData) =>
	client.post<ApiResponse<Pick<OrganizationAttributes, 'id' | 'name' | 'address'>[]>>(`/api/organizations`, data);

export const updateOrganization = ({ id, data }: { id: number; data: FormData }) =>
	client.put<ApiResponse<Pick<OrganizationAttributes, 'id' | 'name' | 'address'>[]>>(
		`/api/organizations/${id}`,
		data
	);
