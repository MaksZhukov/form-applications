import client from '../../client';

export const fetchNewApplicationId = () => client.get<{ data: number }>(`/api/applications/new`);
