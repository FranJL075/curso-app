import path from "path";
import fs from "fs";
import seedCourses from "./seedCourses.json";

// -----------------------------------------------------------------------------
// Capa de datos.
//
// Para desarrollo local guardamos todo en un archivo JSON (data/db.json).
// Cero dependencias nativas, cero compilación: funciona igual en Windows,
// Mac o Linux sin instalar nada extra.
//
// En Vercel el sistema de archivos del proyecto es de solo lectura; lo único
// escribible es /tmp. Por eso, cuando detectamos que corremos en Vercel,
// guardamos ahí en vez de en la carpeta del proyecto. OJO: /tmp no es
// persistente entre despliegues (y puede resetearse entre invocaciones), así
// que esto sirve para probar el sitio funcionando, NO para producción real
// con datos que necesitás conservar.
//
// IMPORTANTE: para producción, reemplazar el contenido de este archivo por
// llamadas a Postgres (Vercel Postgres / Neon / Supabase) usando Prisma o el
// driver `pg`, manteniendo exactamente los mismos nombres de función y
// firmas que se usan acá. El resto de la app (rutas, componentes) no
// necesita cambiar.
// -----------------------------------------------------------------------------

const IS_SERVERLESS = Boolean(process.env.VERCEL);
const DATA_DIR = IS_SERVERLESS
  ? path.join("/tmp", "data")
  : path.join(process.cwd(), "data");
const DATA_PATH = path.join(DATA_DIR, "db.json");

function emptyStore() {
  const courses = seedCourses.map((course, index) => ({
    ...course,
    id: index + 1,
    created_at: new Date().toISOString(),
  }));
  return {
    courses,
    enrollments: [],
    nextCourseId: courses.length + 1,
    nextEnrollmentId: 1,
  };
}

function readStore() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(emptyStore(), null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

function writeStore(store) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));
}

function byCreatedAtDesc(a, b) {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

// ---- Cursos ------------------------------------------------------------

export function getActiveCourses() {
  return readStore()
    .courses.filter((c) => c.is_active)
    .sort(byCreatedAtDesc);
}

export function getAllCourses() {
  return readStore().courses.slice().sort(byCreatedAtDesc);
}

export function getCourseBySlug(slug) {
  return readStore().courses.find((c) => c.slug === slug);
}

export function getCourseById(id) {
  const numId = Number(id);
  return readStore().courses.find((c) => c.id === numId);
}

export function createCourse(data) {
  const store = readStore();
  const course = {
    id: store.nextCourseId,
    ...normalizeCourseInput(data),
    created_at: new Date().toISOString(),
  };
  store.courses.push(course);
  store.nextCourseId += 1;
  writeStore(store);
  return course;
}

export function updateCourse(id, data) {
  const store = readStore();
  const numId = Number(id);
  const index = store.courses.findIndex((c) => c.id === numId);
  if (index === -1) return null;
  const merged = { ...store.courses[index], ...data };
  store.courses[index] = {
    ...store.courses[index],
    ...normalizeCourseInput(merged),
  };
  writeStore(store);
  return store.courses[index];
}

export function deleteCourse(id) {
  const store = readStore();
  const numId = Number(id);
  store.courses = store.courses.filter((c) => c.id !== numId);
  store.enrollments = store.enrollments.filter((e) => e.course_id !== numId);
  writeStore(store);
}

function normalizeCourseInput(data) {
  return {
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    description: data.description,
    duration: data.duration,
    start_date: data.start_date || null,
    spots: data.spots ? Number(data.spots) : null,
    image_url: data.image_url || null,
    is_paid: Boolean(data.is_paid),
    price_cents: data.price_cents ? Number(data.price_cents) : null,
    currency: data.currency || "ARS",
    is_active: data.is_active === undefined ? true : Boolean(data.is_active),
  };
}

// ---- Inscripciones ------------------------------------------------------

export function createEnrollment({ courseId, fullName, email, phone }) {
  const store = readStore();
  const course = store.courses.find((c) => c.id === Number(courseId));
  if (!course) throw new Error("Curso no encontrado");

  // Placeholder para pagos: si el curso es pago, la inscripción queda
  // "pending_payment" en lugar de confirmarse directamente. El día que se
  // integre una pasarela (Mercado Pago / Stripe), acá es donde se debe:
  //   1) crear la preferencia/checkout de pago,
  //   2) guardar su referencia en payment_reference,
  //   3) confirmar el pago vía webhook actualizando payment_status a 'paid'.
  const enrollment = {
    id: store.nextEnrollmentId,
    course_id: course.id,
    full_name: fullName,
    email,
    phone,
    payment_status: course.is_paid ? "pending_payment" : "not_required",
    payment_reference: null,
    created_at: new Date().toISOString(),
  };
  store.enrollments.push(enrollment);
  store.nextEnrollmentId += 1;
  writeStore(store);
  return enrollment;
}

export function getEnrollmentsByCourse(courseId) {
  const numId = Number(courseId);
  return readStore()
    .enrollments.filter((e) => e.course_id === numId)
    .sort(byCreatedAtDesc);
}

export function getAllEnrollments() {
  const store = readStore();
  return store.enrollments
    .map((e) => ({
      ...e,
      course_title: store.courses.find((c) => c.id === e.course_id)?.title || "",
    }))
    .sort(byCreatedAtDesc);
}

export function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
