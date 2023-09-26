import { FileAttributes } from '@/db/file/types';
import client from '../client';
import { ApiResponse } from '../types';
import { CommentAttributes } from '@/db/comment/types';

export const fetchComments = (applicationId: number) =>
	client
		.get<ApiResponse<CommentAttributes[]>>(`/api/comments`, { params: { applicationId } })
		.then((res) => res.data);
