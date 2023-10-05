import client from '../../client';

export const fetchNewApplicationId = (applicationType: 'common' | 'internal' = 'common') =>
	client.get<{ data: number }>(`/api/applications/new`, { params: { applicationType } });
