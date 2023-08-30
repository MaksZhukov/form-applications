import { FileAttributes } from '@/db/files/types';
import client from '../client';
import { ApiResponse } from '../types';

export const getFiles = (applicationId: number) =>
	client.get<ApiResponse<FileAttributes[]>>(`/api/files`, { params: { applicationId } }).then((res) => res.data);

export const uploadFiles = (params: { applicationId: number; data: FormData }) =>
	client
		.post<ApiResponse<FileAttributes[]>>(`/api/files`, params.data, {
			params: { applicationId: params.applicationId }
		})
		.then((res) => res.data);
