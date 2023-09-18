import client from '../client';
import { ApiResponse } from '../types';

export const fetchSocket = () =>
	client
		.get<ApiResponse<{}>>(`/api/socket`);
