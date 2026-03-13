import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const c = cookies();
  const token = c.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET || "bazagod-admin-2024";
  const ok = token === secret;
  return NextResponse.json({ ok });
}
