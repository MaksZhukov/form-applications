import { User } from '@/services/db/users/types';
import client from '../client';
import { ApiResponse } from '../types';

export const fetchUsers = () => client.get<ApiResponse<User[]>>(`/api/users`);
