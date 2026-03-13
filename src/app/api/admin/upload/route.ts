import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const DATA_PATH = path.join(process.cwd(), "public", "data", "uploaded-gallery.json");

const CATEGORIES = ["rooms", "dining", "lake", "spa", "events", "nature"] as const;

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

function isAdmin(): boolean {
  const c = cookies();
  const token = c.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET || "bazagod-admin-2024";
  return token === secret;
}

export async function POST(request: NextRequest) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Non autorisé. Connectez-vous à l’admin." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Données formulaire invalides" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier envoyé" }, { status: 400 });
  }

  const alt = (formData.get("alt") as string) || file.name;
  const category = (formData.get("category") as string) || "nature";
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return NextResponse.json({ error: "Catégorie invalide" }, { status: 400 });
  }

  const ext = path.extname(file.name) || ".jpg";
  const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const filename = `${id}${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);

  await mkdir(UPLOADS_DIR, { recursive: true });
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const { writeFile } = await import("fs/promises");
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
