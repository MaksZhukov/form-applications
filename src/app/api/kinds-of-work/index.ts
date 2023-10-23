import client from '../client';
import { ApiResponse } from '../types';
import { KindsOfWorkAttributes } from '@/db/kindsOfWork/types';

export const fetchKindsOfWork = () =>
	client.get<ApiResponse<KindsOfWorkAttributes[]>>(`/api/kinds-of-work`).then((res) => res.data);

export const createKindOfWork = (data: { name: string }) =>
	client.post<ApiResponse<KindsOfWorkAttributes>>(`/api/kinds-of-work`, { data });
