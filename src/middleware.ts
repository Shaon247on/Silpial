import { NextRequest, NextResponse } from 'next/server';
import { COOKIE, isProd } from '@/lib/auth/cookies';

const PROTECTED = ['/dashboard', '/admin'];

function isProtectedPath(pathname: string) {
  return PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function base64UrlDecode(input: string): string {
  const pad = '='.repeat((4 - (input.length % 4)) % 4);
  const b64 = (input + pad).replace(/-/g, '+').replace(/_/g, '/');
  // atob is available in Edge runtimes
  return atob(b64);
}

function getJwtExpMsEdge(token: string): number | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const json = JSON.parse(base64UrlDecode(payload)) as { exp?: number };
    return json.exp ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

async function refreshAccessToken(req: NextRequest, refreshToken: string) {
  const backendBase = process.env.BACKEND_BASE_URL!;
  const refreshPath = process.env.BACKEND_REFRESH_PATH!;

  const r = await fetch(`${backendBase}${refreshPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!r.ok) return null;

  // Expecting { access: string, refresh?: string }
  const data = (await r.json()) as { access?: string; refresh?: string };
  if (!data.access) return null;
  return data;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public access
  if (!isProtectedPath(pathname) && pathname !== '/login') {
    return NextResponse.next();
  }

  const access = req.cookies.get(COOKIE.access)?.value;
  const refresh = req.cookies.get(COOKIE.refresh)?.value;

  // If user hits /login while authenticated, route them into the app
  if (pathname === '/login' && access) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Not authenticated
  if (!access && !refresh && isProtectedPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // If access exists but is expired/near-expired, refresh it using refresh token
  const expMs = access ? getJwtExpMsEdge(access) : null;
  const isExpiring =
    !expMs ? false : expMs - Date.now() < 60_000; // refresh if <60s remaining

  if ((!access && refresh) || (access && refresh && isExpiring)) {
    const refreshed = await refreshAccessToken(req, refresh!);

    // Refresh failed => clear cookies and redirect to login (protected paths only)
    if (!refreshed && isProtectedPath(pathname)) {
      const res = NextResponse.redirect(new URL('/login', req.url));
      res.cookies.delete(COOKIE.access);
      res.cookies.delete(COOKIE.refresh);
      res.cookies.delete(COOKIE.session);
      return res;
    }

    if (refreshed?.access) {
      const res = NextResponse.next();

      // Access token cookie; TTL approximate (your backend token exp is authoritative)
      res.cookies.set({
        name: COOKIE.access,
        value: refreshed.access,
        httpOnly: true,
        secure: isProd,
        sameSite: 'strict',
        path: '/',
      });

      // If backend rotates refresh token, persist it.
      if (refreshed.refresh) {
        res.cookies.set({
          name: COOKIE.refresh,
          value: refreshed.refresh,
          httpOnly: true,
          secure: isProd,
          sameSite: 'strict',
          path: '/',
        });
      }

      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
};
