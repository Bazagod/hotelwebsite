import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "public", "data", "site-content.json");
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function verifyAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  try {
    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: authHeader, Accept: "application/json" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const data = await readFile(DATA_PATH, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await mkdir(path.dirname(DATA_PATH), { recursive: true });
    await writeFile(DATA_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true, data: body });
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
