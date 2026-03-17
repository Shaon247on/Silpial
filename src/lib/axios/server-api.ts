import "server-only";
import axios from "axios";
import { cookies } from "next/headers";
import { env } from "@/lib/config/env";
import { COOKIE } from "@/lib/auth/cookies";

export const serverApi = axios.create({
  baseURL: env.BACKEND_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

serverApi.interceptors.request.use(async (config) => {
  const store = await cookies();
  const accessToken = store.get(COOKIE.access)?.value;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});