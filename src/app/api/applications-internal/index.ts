import { ApplicationAttributes } from '@/db/application/types';
import { OrganizationAttributes } from '@/db/organization/types';
import qs from 'query-string';
import client from '../client';
import { ApiResponse } from '../types';

export const fetchApplications = (offset: number = 1, status?: string, organizationId?: string) =>
	client.get<
		ApiResponse<(ApplicationAttributes & { organization: Pick<OrganizationAttributes, 'id' | 'name' | 'uid'> })[]>
	>(`/api/applications?${qs.stringify({ offset, status, organizationId })}`);

export const createApplication = (data: FormData) =>
	client.post<ApiResponse<ApplicationAttributes>>(`/api/applications`, data);
