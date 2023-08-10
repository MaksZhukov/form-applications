import qs from 'query-string';
import client from '../client';
import { ApiResponse } from '../types';
import { ApiApplication } from './types';

export const fetchApplications = (offset: number = 1, status?: string, organizationName?: string) =>
	client.get<ApiResponse<ApiApplication[]>>(
		`/api/applications?${qs.stringify({ offset, status, organizationName })}`
	);

export const createApplication = (data: FormData) =>
	client.post<ApiResponse<ApiApplication[]>>(`/api/applications`, data);
