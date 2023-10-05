import { ApplicationAttributes } from '@/db/application/types';
import client from '../../client';
import { ApiResponse } from '../../types';
import { OrganizationAttributes } from '@/db/organization/types';
import { ApplicationInternalAttributes } from '@/db/applicationInternal/types';

export const fetchApplication = <T extends 'common' | 'internal'>(id: number, applicationType: T) =>
	client
		.get<{ data: T extends 'common' ? ApplicationAttributes : ApplicationInternalAttributes }>(
			`/api/applications/${id}`,
			{
				params: { applicationType }
			}
		)
		.then((res) => res.data);

export const updateApplication = (params: { id: number; data: FormData }) =>
	client
		.put<ApiResponse<ApplicationAttributes & { organization: Pick<OrganizationAttributes, 'id' | 'name'> }>>(
			`/api/applications/${params.id}`,
			params.data
		)
		.then((res) => res.data);
