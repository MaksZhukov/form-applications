import { FileAttributes } from '@/db/files/types';
import client from '../client';
import { ApiResponse } from '../types';
import { CommentAttributes } from '@/db/comments/types';

export const getComments = (applicationId: number) =>
	client
		.get<ApiResponse<CommentAttributes[]>>(`/api/comments`, { params: { applicationId } })
		.then((res) => res.data);
