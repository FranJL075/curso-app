import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/requireAdmin";
import { getAllCourses, createCourse, slugify, getCourseBySlug } from "@/lib/db";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  return NextResponse.json({ courses: await getAllCourses() });
}

export async function POST(request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const data = await request.json().catch(() => ({}));
  if (!data.title || !data.summary || !data.description || !data.duration) {
    return NextResponse.json(
      { error: "Título, resumen, descripción y duración son obligatorios." },
      { status: 400 }
    );
  }

  let slug = slugify(data.title);
  if (await getCourseBySlug(slug)) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const course = await createCourse({ ...data, slug });
  return NextResponse.json({ course }, { status: 201 });
}
