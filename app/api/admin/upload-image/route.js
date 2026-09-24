import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/requireAdmin";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "No se pudo leer el archivo." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Debés seleccionar una imagen." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Solo se permiten imágenes JPG, PNG o WEBP." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "La imagen debe pesar menos de 10 MB." }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const extension = path.extname(file.name || ".jpg").toLowerCase() || ".jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`;
  const filePath = path.join(uploadsDir, safeName);

  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, bytes);

  return NextResponse.json({ url: `/uploads/${safeName}` });
}
