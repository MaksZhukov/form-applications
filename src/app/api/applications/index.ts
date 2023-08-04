import client from '../client';
import { ApiResponse } from '../types';
import { ApiApplication } from './types';

export const fetchApplications = (offset: number = 1) =>
	client.get<ApiResponse<ApiApplication[]>>(`/api/applications?offset=${offset}`);

export const createApplication = (data: FormData) =>
	client.post<ApiResponse<ApiApplication[]>>(`/api/applications`, data);
