import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "public", "data", "uploaded-gallery.json");

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

function isAdmin(c: ReturnType<typeof cookies>): boolean {
  const token = c.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET || "bazagod-admin-2024";
  return token === secret;
}

export async function GET() {
  const images = await getUploadedImages();
  return NextResponse.json(images);
}

export async function DELETE(request: NextRequest) {
  const c = cookies();
  if (!isAdmin(c)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id manquant" }, { status: 400 });
  }
  const images = await getUploadedImages();
  const filtered = images.filter((img) => img.id !== id);
  if (filtered.length === images.length) {
    return NextResponse.json({ error: "Image introuvable" }, { status: 404 });
  }
  await saveUploadedImages(filtered);
  return NextResponse.json({ ok: true });
}
