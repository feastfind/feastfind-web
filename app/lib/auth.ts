import type { paths } from '@/schema';
import { ENV } from '@/env';
import { z } from 'zod';

type User =
  paths['/users']['get']['responses'][200]['content']['application/json'];

type UserLoginResponse =
  paths['/auth/login']['post']['responses'][200]['content']['application/json'];

type UserRegisterResponse =
  paths['/auth/register']['post']['responses'][201]['content']['application/json'];

export const UserRegisterPayloadSchema = z.object({
  name: z.string({ message: 'Name is required' }),
  username: z.string({ message: 'Username is required' }),
  email: z.string({ message: 'Email is required' }),
  password: z.string({ message: 'Password is required' }), // TODO: Password requirements
  avatarURL: z.string().optional(),
});

export type UserRegisterPayload = z.infer<typeof UserRegisterPayloadSchema>;

export type UserLoginPayload = {
  identifier: string;
  password: string;
};

export type Auth = {
  isAuthenticated: boolean;
  getToken: () => void;
  register: (userRegister: UserRegisterPayload) => Promise<boolean>;
  login: (userLogin: UserLoginPayload) => Promise<boolean>;
  checkUser(): Promise<User | undefined>;
  logout(): void;
};

export const auth: Auth = {
  isAuthenticated: false,
  getToken: () => {},
  register: async (userRegister: UserRegisterPayload) => {
    const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userRegister),
      headers: { 'Content-Type': 'application/json' },
    });

    const user: UserRegisterResponse = await response.json();
    if (!user) return false;
    return true;
  },
  login: async (userLogin: UserLoginPayload) => {
    try {
      const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(userLogin),
        headers: { 'Content-Type': 'application/json' },
      });

      const data: UserLoginResponse = await response.json();
      if (!data) return false;

      auth.isAuthenticated = true;
      return true;
    } catch (error) {
      auth.isAuthenticated = false;
      return false;
    }
  },
  checkUser: async () => {
    try {
      const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ` },
      });
      const user: User = await response.json();

      auth.isAuthenticated = true;
      return user;
    } catch (error) {
      auth.isAuthenticated = false;
    }
  },
  logout: () => {
    auth.isAuthenticated = false;
  },
};
