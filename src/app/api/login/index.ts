import client from '../client';

export const login = (email: string, password: string) => client.post(`/api/login`, { data: { email, password } });
