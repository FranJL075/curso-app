import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/requireAdmin";
import { getCourseById, getEnrollmentsByCourse } from "@/lib/db";

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export async function GET(request, { params }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) {
    return NextResponse.json({ error: "Curso no encontrado." }, { status: 404 });
  }

  const rows = [
    [
      "Curso",
      "Nombre y apellido",
      "Email",
      "Teléfono",
      "Estado de pago",
      "Fecha de registro",
    ],
    ...(await getEnrollmentsByCourse(id)).map((enrollment) => [
      course.title,
      enrollment.full_name,
      enrollment.email,
      enrollment.phone,
      enrollment.payment_status,
      formatDate(enrollment.created_at),
    ]),
  ];

  const csv = `\ufeff${rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n")}\r\n`;
  const filename = `${course.slug}-contactos.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
