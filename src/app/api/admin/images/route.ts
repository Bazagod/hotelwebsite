import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "public", "data", "uploaded-gallery.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export type UploadedImage = {
  id: string;
  src: string;
  alt: string;
  category: string;
  createdAt: string;
};

async function getUploadedImages(): Promise<UploadedImage[]> {
  try {
    const data = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveUploadedImages(images: UploadedImage[]) {
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

export async function GET() {
  const images = await getUploadedImages();
  return NextResponse.json(images);
}

export async function DELETE(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const images = await getUploadedImages();
  const image = images.find((img) => img.id === id);
  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  try {
    const filePath = path.join(UPLOADS_DIR, path.basename(image.src));
    await unlink(filePath).catch(() => {});
  } catch {
    // file may already be deleted
  }

  const filtered = images.filter((img) => img.id !== id);
  await saveUploadedImages(filtered);
  return NextResponse.json({ ok: true });
}
