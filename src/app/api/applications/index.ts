import { ApplicationAttributes } from '@/db/application/types';
import qs from 'query-string';
import client from '../client';
import { ApiResponse, ApplicationType } from '../types';
import { ApplicationInternalAttributes } from '@/db/applicationInternal/types';

export const fetchApplications = <T extends ApplicationType>(
	offset: number = 1,
	applicationType: T,
	status?: string,
	organizationId?: string,
	responsibleUserId?: string
) =>
	client.get<ApiResponse<(T extends 'common' ? ApplicationAttributes : ApplicationInternalAttributes)[]>>(
		`/api/applications?${qs.stringify({ offset, status, applicationType, organizationId, responsibleUserId })}`
	);

export const createApplication = <T extends ApplicationType>({
	data,
	applicationType
}: {
	data: FormData;
	applicationType: T;
}) =>
	client.post<ApiResponse<T extends 'common' ? ApplicationAttributes : ApplicationInternalAttributes>>(
		`/api/applications`,
		data,
		{ params: { applicationType } }
	);
