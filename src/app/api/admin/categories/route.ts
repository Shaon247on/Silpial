import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE } from "@/lib/auth/cookies";
import { env } from "@/lib/config/env";

export async function GET(req: NextRequest) {
  const store = await cookies();
  const token = store.get(COOKIE.access)?.value ?? "";

  const { searchParams } = new URL(req.url);
  const params = new URLSearchParams();

  const page = searchParams.get("page");
  const name = searchParams.get("name");
  if (page) params.set("page", page);
  if (name) params.set("name", name);

  try {
    const res = await fetch(
      `${env.BACKEND_BASE_URL}/api/v1/document/categories/?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}