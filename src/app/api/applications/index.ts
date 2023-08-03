import client from '../client';
import { ApiResponse } from '../types';
import { ApiApplication } from './types';

export const fetchApplications = (offset: number = 1) =>
	client.get<ApiResponse<ApiApplication[]>>(`/api/applications?offset=${offset}`).then((res) => res.data);
