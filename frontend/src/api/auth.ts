import { isAxiosError } from 'axios';
import client from './client';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface LoginResponse {
  token: string;
  user: AuthenticatedUser;
}

interface AuthServiceLoginResponse {
  access_token: string;
  user: AuthenticatedUser;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const { data } = await client.post<AuthServiceLoginResponse>('/auth/login', { email, password });
    localStorage.setItem('labflow_token', data.access_token);

    return { token: data.access_token, user: data.user };
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to sign in. Please try again.');
    }

    throw error;
  }
}
