import { OrganizationAttributes } from '@/db/organization/types';
import client from '../client';
import { ApiResponse } from '../types';
import { UserAttributes } from '@/db/users/types';

export const fetchUser = () =>
	client
		.get<ApiResponse<UserAttributes & { organization: OrganizationAttributes }>>(`/api/user`)
		.then((res) => res.data);
