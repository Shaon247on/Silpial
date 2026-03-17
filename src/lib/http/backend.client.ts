import 'server-only';
import axios, { type AxiosInstance } from 'axios';
import { cookies } from 'next/headers';
import { env } from '@/lib/config/env';
import { COOKIE } from '@/lib/auth/cookies';

export async function createBackendClient(): Promise<AxiosInstance> {
  const store = await cookies();
  const access = store.get(COOKIE.access)?.value;

  const client = axios.create({
    baseURL: env.BACKEND_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    // You typically want to treat 4xx/5xx as errors in app logic:
    validateStatus: (s) => s >= 200 && s < 300,
  });

  if (access) {
    client.defaults.headers.common.Authorization = `Bearer ${access}`;
  }

  return client;
}
