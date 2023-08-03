import { User } from '@/services/db/users/types';
import client from '../client';

export const fetchUser = () => client.get<{ data: User }>(`/api/user`);
