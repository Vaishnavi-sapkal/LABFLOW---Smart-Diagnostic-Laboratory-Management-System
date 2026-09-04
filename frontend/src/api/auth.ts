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

interface ProtectedAuthResponse {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

interface AuthServiceLoginResponse {
  access_token: string;
  user: AuthenticatedUser;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const { data } = await client.post<AuthServiceLoginResponse>('/auth/login', { email, password });
    localStorage.setItem('labflow_token', data.access_token);
    localStorage.setItem('labflow_user', JSON.stringify(data.user));

    return { token: data.access_token, user: data.user };
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to sign in. Please try again.');
    }

    throw error;
  }
}

export async function getCurrentUser(): Promise<AuthenticatedUser> {
  try {
    const { data } = await client.get<ProtectedAuthResponse>('/auth/protected');
    const storedUser = getStoredUser();

    if (storedUser?.id === data.user.userId) {
      return {
        ...storedUser,
        id: data.user.userId,
        email: data.user.email,
        role: data.user.role,
      };
    }

    return {
      id: data.user.userId,
      name: data.user.email,
      email: data.user.email,
      role: data.user.role,
      isActive: true,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data?.message;
      throw new Error(typeof message === 'string' ? message : 'Unable to restore your session. Please sign in again.');
    }

    throw error;
  }
}

export function clearStoredSession() {
  localStorage.removeItem('labflow_token');
  localStorage.removeItem('labflow_user');
}

function getStoredUser(): AuthenticatedUser | null {
  const storedUser = localStorage.getItem('labflow_user');
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as AuthenticatedUser;
  } catch {
    localStorage.removeItem('labflow_user');
    return null;
  }
}
