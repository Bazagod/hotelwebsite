import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const password = body?.password ?? "";
  const secret = process.env.ADMIN_SECRET || "bazagod-admin-2024";

  if (password !== secret) {
    return NextResponse.json({ ok: false, error: "Mot de passe incorrect" }, { status: 401 });
  }

  const cookieStore = cookies();
  cookieStore.set("admin_token", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24h
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
