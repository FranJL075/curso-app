import { NextResponse } from "next/server";
import { handleUpload } from "@vercel/blob/client";
import { isAdminRequest } from "@/lib/requireAdmin";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (request.headers.get("content-type")?.includes("application/json")) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Falta configurar BLOB_READ_WRITE_TOKEN para subir imágenes." },
        { status: 503 }
      );
    }

    try {
      const body = await request.json();
      const result = await handleUpload({
        request,
        body,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_FILE_SIZE,
          addRandomSuffix: true,
        }),
      });

      return NextResponse.json(result);
    } catch (error) {
      console.error("Error al autorizar la carga de imagen:", error);
      return NextResponse.json(
        { error: "No se pudo preparar la carga. Verificá la configuración de Vercel Blob." },
        { status: 500 }
      );
    }
  }

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "La carga debe realizarse directamente a Vercel Blob." },
      { status: 400 }
    );
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "No se pudo leer el archivo." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Debés seleccionar una imagen." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Solo se permiten imágenes JPG, PNG o WEBP." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "La imagen debe pesar menos de 10 MB." }, { status: 400 });
  }

  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const extension = path.extname(file.name || ".jpg").toLowerCase() || ".jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`;
    const filePath = path.join(uploadsDir, safeName);
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, bytes);

    return NextResponse.json({ url: `/uploads/${safeName}` });
  } catch (error) {
    console.error("Error al guardar la imagen localmente:", error);
    return NextResponse.json({ error: "No se pudo guardar la imagen localmente." }, { status: 500 });
  }
}
