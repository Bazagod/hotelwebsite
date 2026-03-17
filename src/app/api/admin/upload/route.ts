import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const DATA_PATH = path.join(process.cwd(), "public", "data", "uploaded-gallery.json");
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const CATEGORIES = ["rooms", "dining", "lake", "spa", "events", "nature", "hero", "general"] as const;

async function getUploadedImages(): Promise<{ id: string; src: string; alt: string; category: string; createdAt: string }[]> {
  try {
    const data = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveUploadedImages(images: { id: string; src: string; alt: string; category: string; createdAt: string }[]) {
  await mkdir(path.dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(images, null, 2), "utf-8");
}

async function verifyAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: { Authorization: authHeader, Accept: "application/json" },
      });
      return res.ok;
    } catch {
      return false;
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: "Unauthorized. Please log in to the dashboard." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const alt = (formData.get("alt") as string) || file.name;
  const category = (formData.get("category") as string) || "general";
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const ext = path.extname(file.name) || ".jpg";
  const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const filename = `${id}${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);

  await mkdir(UPLOADS_DIR, { recursive: true });
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filepath, buffer);

  const src = `/uploads/${filename}`;
  const newImage = {
    id,
    src,
    alt,
    category,
    createdAt: new Date().toISOString(),
  };

  const images = await getUploadedImages();
  images.push(newImage);
  await saveUploadedImages(images);

  return NextResponse.json({ ok: true, image: newImage });
}
