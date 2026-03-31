import { api } from '@/lib/api';
import type { User } from '@/types';

export interface LoginResponse {
  accessToken: string;
  user: Omit<User, 'password'>;
}

export const authApi = {
  login: async (credentials: Record<string, string>): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },
};
