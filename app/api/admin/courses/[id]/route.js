import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/requireAdmin";
import {
  getCourseById,
  updateCourse,
  deleteCourse,
  getEnrollmentsByCourse,
} from "@/lib/db";

export async function GET(request, { params }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { id } = await params;
  const course = getCourseById(id);
  if (!course) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  const enrollments = getEnrollmentsByCourse(id);
  return NextResponse.json({ course, enrollments });
}

export async function PUT(request, { params }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { id } = await params;
  const data = await request.json().catch(() => ({}));
  const course = updateCourse(id, data);
  if (!course) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  return NextResponse.json({ course });
}

export async function DELETE(request, { params }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { id } = await params;
  deleteCourse(id);
  return NextResponse.json({ ok: true });
}
