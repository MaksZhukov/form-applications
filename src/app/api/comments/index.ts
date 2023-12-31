import { FileAttributes } from '@/db/file/types';
import client from '../client';
import { ApiResponse } from '../types';
import { CommentAttributes } from '@/db/comment/types';
import { API_LIMIT_ITEMS } from '@/constants';

export const fetchComments = (applicationId: number, applicationType: 'common' | 'internal', page: number) =>
	client
		.get<ApiResponse<CommentAttributes[]>>(`/api/comments`, {
			params: { applicationType, applicationId, offset: page * API_LIMIT_ITEMS }
		})
		.then((res) => res.data.data);
