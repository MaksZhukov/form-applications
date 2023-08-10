import client from '../../client';
import { ApiResponse } from '../../types';
import { ApiApplication } from '../types';

export const fetchApplication = (id: number) =>
	client.get<{ data: ApiApplication }>(`/api/applications/${id}`).then((res) => res.data);

export const updateApplication = (params: { id: number; data: FormData }) =>
	client.put<ApiResponse<ApiApplication>>(`/api/applications/${params.id}`, params.data).then((res) => res.data);
