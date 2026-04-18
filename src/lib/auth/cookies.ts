import 'server-only';
import { env } from '@/lib/config/env';

export const isProd = env.NODE_ENV === 'production';

/**
 * In production, prefer  prefixed cookies for host-only protection.
 * In local dev, prefixed cookies + Secure can be inconsistent on http://localhost.
 */
export const COOKIE = Object.freeze({
  access: isProd ? 'access' : 'dev_access',
  refresh: isProd ? 'refresh' : 'dev_refresh',
  session: isProd ? 'session' : 'dev_session',
  verification: "verification_token",
  passReset: "pass_reset_token",
  passwordResetVerified: "password_reset_verified",
});

export function cookieBaseOptions() {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict' as const,
    path: '/' as const,
  };
}
