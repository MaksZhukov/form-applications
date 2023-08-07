import client from '../../client';
import { ApiApplication } from '../types';

export const fetchApplication = (id: number) => client.get<{ data: ApiApplication }>(`/api/applications/${id}`);

export const updateApplication = (params: { id: number; data: FormData }) =>
	client.put<any>(`/api/applications/${params.id}`, params.data);
