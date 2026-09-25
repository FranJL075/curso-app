import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/requireAdmin";
import {
  getCourseById,
  updateCourse,
  deleteCourse,
  getEnrollmentsByCourse,
} from "@/lib/db";
import { getCourseTextLengthError } from "@/lib/courseLimits";

export async function GET(request, { params }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  const enrollments = await getEnrollmentsByCourse(id);
  return NextResponse.json({ course, enrollments });
}

export async function PUT(request, { params }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { id } = await params;
  const data = await request.json().catch(() => ({}));
  const current = await getCourseById(id);
  if (!current) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  const textLengthError = getCourseTextLengthError({ ...current, ...data });
  if (textLengthError) {
    return NextResponse.json({ error: textLengthError }, { status: 400 });
  }
  const course = await updateCourse(id, data);
  if (!course) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  return NextResponse.json({ course });
}

export async function DELETE(request, { params }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { id } = await params;
  const course = await deleteCourse(id);
  if (!course) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  return NextResponse.json({ ok: true, course });
}
