import { ApplicationAttributes } from '@/db/application/types';
import client from '../../client';
import { ApiResponse } from '../../types';
import { OrganizationAttributes } from '@/db/organization/types';

export const fetchApplication = (id: number) =>
	client
		.get<{ data: ApplicationAttributes & { organization: Pick<OrganizationAttributes, 'id' | 'email' | 'name'> } }>(
			`/api/applications/${id}`
		)
		.then((res) => res.data);

export const updateApplication = (params: { id: number; data: FormData }) =>
	client
		.put<
			ApiResponse<ApplicationAttributes & { organization: Pick<OrganizationAttributes, 'id' | 'email' | 'name'> }>
		>(`/api/applications/${params.id}`, params.data)
		.then((res) => res.data);
