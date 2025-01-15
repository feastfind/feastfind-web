import type { paths } from '@/schema';
import { ENV } from '@/env';
import { z } from 'zod';
import { Cookies as ReactCookie } from 'react-cookie';
import { dueDate } from './utils';

export type User =
  paths['/auth/me']['get']['responses'][200]['content']['application/json']['user'];

type UserLoginResponse =
  paths['/auth/login']['post']['responses'][200]['content']['application/json'];

type UserRegisterResponse =
  paths['/auth/register']['post']['responses'][201]['content']['application/json'];

export const UserLoginrPayloadSchema = z.object({
  identifier: z.string({ message: 'This field is required' }),
  password: z.string({ message: 'This field is required' }),
});

export const UserRegisterPayloadSchema = z.object({
  name: z.string({ message: 'Name is required' }),
  username: z.string({ message: 'Username is required' }),
  email: z.string({ message: 'Email is required' }),
  password: z.string({ message: 'Password is required' }), // TODO: Password requirements
  avatarURL: z.string().optional(),
});

export type UserRegisterPayload = z.infer<typeof UserRegisterPayloadSchema>;

export type UserLoginPayload = z.infer<typeof UserLoginrPayloadSchema>;

export type Auth = {
  isAuthenticated: boolean;
  getToken: () => void;
  register: (userRegister: UserRegisterPayload) => Promise<boolean>;
  login: (userLogin: UserLoginPayload) => Promise<boolean>;
  getUser(): Promise<User | null>;
  logout(): void;
};

export const auth: Auth = {
  isAuthenticated: false,
  getToken: () => {
    return accessToken.get();
  },
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
      if (!data.token) {
        throw new Error('Unable to proccess request, login failed');
      }

      accessToken.set(data.token);
      auth.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error(error);
      accessToken.remove();
      auth.isAuthenticated = false;
      return false;
    }
  },
  getUser: async () => {
    const token = accessToken.get();
    if (!token) return null;
    try {
      const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const responseJSON = await response.json();
      const user: User = responseJSON.user;
      auth.isAuthenticated = true;
      return user;
    } catch (error) {
      accessToken.remove();
      auth.isAuthenticated = false;
      return null;
    }
  },
  logout: () => {
    accessToken.remove();
    auth.isAuthenticated = false;
  },
};

const COOKIE_NAME = 'access-token-name';

export const accessTokenCookie = new ReactCookie(null, {
  path: '/',
  sameSite: 'none',
  secure: true,
  expires: dueDate(30), // 30 days
});

export const accessToken = {
  get: () => {
    return accessTokenCookie.get(COOKIE_NAME) || null;
  },
  set: (token: string) => {
    accessTokenCookie.set(COOKIE_NAME, token);
  },
  remove: () => {
    accessTokenCookie.remove(COOKIE_NAME);
  },
};
