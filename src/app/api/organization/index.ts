import { OrganizationAttributes } from '@/db/organization/types';
import client from '../client';
import { ApiResponse } from '../types';

export const fetchOrganization = () =>
	client.get<ApiResponse<OrganizationAttributes>>(`/api/organization`).then((res) => res.data);
