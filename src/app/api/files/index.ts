import { FileAttributes } from '@/db/file/types';
import client from '../client';
import { ApiResponse, ApplicationType } from '../types';

export const fetchFiles = <T extends ApplicationType>(applicationId: number, applicationType: T) =>
	client
		.get<ApiResponse<FileAttributes[]>>(`/api/files`, { params: { applicationId, applicationType } })
		.then((res) => res.data);

export const uploadFiles = <T extends ApplicationType>({
	applicationId,
	applicationType,
	data
}: {
	applicationId: number;
	data: FormData;
	applicationType: T;
}) =>
	client
		.post<ApiResponse<FileAttributes[]>>(`/api/files`, data, {
			params: { applicationId, applicationType }
		})
		.then((res) => res.data);
