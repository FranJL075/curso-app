import { Pool } from "pg";
let postgresPool;

// ---- Cursos ------------------------------------------------------------

export async function getActiveCourses() {
  const { rows } = await getPostgresPool().query(
    `SELECT * FROM courses
     WHERE is_active = TRUE
     ORDER BY CASE slug
       WHEN 'we-master-estetica' THEN 0
       WHEN 'induccion-colageno-microagujas' THEN 1
       WHEN 'plasma-pen-fibroblast' THEN 2
       WHEN 'master-wax-corporal' THEN 3
       WHEN 'master-men-brazilian-wax' THEN 4
       WHEN 'iv-therapy-oligoelementos' THEN 5
       WHEN 'flebotomia-nacional-prp-prf' THEN 6
       ELSE 7
     END, created_at DESC`
  );
  return rows;
}

export async function getAllCourses() {
  const { rows } = await getPostgresPool().query(
    "SELECT * FROM courses ORDER BY created_at DESC"
  );
  return rows;
}

export async function getCourseBySlug(slug) {
  const { rows } = await getPostgresPool().query(
    "SELECT * FROM courses WHERE slug = $1 LIMIT 1",
    [slug]
  );
  return rows[0] || null;
}

export async function getCourseById(id) {
  const { rows } = await getPostgresPool().query(
    "SELECT * FROM courses WHERE id = $1 LIMIT 1",
    [Number(id)]
  );
  return rows[0] || null;
}

export async function createCourse(data) {
  const course = normalizeCourseInput(data);
  const { rows } = await getPostgresPool().query(
    `INSERT INTO courses
      (category, slug, title, summary, description, duration, modality,
       includes, requirements, payment, price_label, start_date, spots,
       image_url, is_paid, price_cents, currency, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
       $14, $15, $16, $17, $18)
     RETURNING *`,
    courseValues(course)
  );
  return rows[0];
}

export async function updateCourse(id, data) {
  const current = await getCourseById(id);
  if (!current) return null;
  const course = normalizeCourseInput({ ...current, ...data });
  const { rows } = await getPostgresPool().query(
    `UPDATE courses SET
      category = $1, slug = $2, title = $3, summary = $4, description = $5,
      duration = $6, modality = $7, includes = $8, requirements = $9,
      payment = $10, price_label = $11, start_date = $12, spots = $13,
      image_url = $14, is_paid = $15, price_cents = $16, currency = $17,
      is_active = $18, updated_at = CURRENT_TIMESTAMP
     WHERE id = $19
     RETURNING *`,
    [...courseValues(course), Number(id)]
  );
  return rows[0] || null;
}

export async function deleteCourse(id) {
  const numId = Number(id);
  const { rowCount: enrollmentCount } = await getPostgresPool().query(
    "SELECT 1 FROM enrollments WHERE course_id = $1 LIMIT 1",
    [numId]
  );
  if (enrollmentCount > 0) {
    const { rows } = await getPostgresPool().query(
      "UPDATE courses SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [numId]
    );
    return rows[0] || null;
  }
  const { rows } = await getPostgresPool().query(
    "DELETE FROM courses WHERE id = $1 RETURNING *",
    [numId]
  );
  return rows[0] || null;
}

function normalizeCourseInput(data) {
  return {
    category: data.category || "General",
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    description: data.description,
    duration: data.duration,
    modality: data.modality || data.duration || "Presencial",
    includes: data.includes || "",
    requirements: data.requirements || "",
    payment: data.payment || "",
    price_label: data.price_label || "",
    start_date: data.start_date || null,
    spots: data.spots === undefined || data.spots === null || data.spots === ""
      ? null
      : Number(data.spots),
    image_url: data.image_url || null,
    is_paid: Boolean(data.is_paid),
    price_cents: data.price_cents === undefined || data.price_cents === null || data.price_cents === ""
      ? null
      : Number(data.price_cents),
    currency: data.currency || "ARS",
    is_active: data.is_active === undefined ? true : Boolean(data.is_active),
  };
}

function courseValues(course) {
  return [
    course.category,
    course.slug,
    course.title,
    course.summary,
    course.description,
    course.duration,
    course.modality,
    course.includes,
    course.requirements,
    course.payment,
    course.price_label,
    course.start_date,
    course.spots,
    course.image_url,
    course.is_paid,
    course.price_cents,
    course.currency,
    course.is_active,
 
  ];
}

// ---- Inscripciones ------------------------------------------------------

function getPostgresPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no está configurada para acceder a PostgreSQL.");
  }
  if (!postgresPool) {
    postgresPool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return postgresPool;
}

export async function createEnrollment({ courseId, fullName, email, phone, message = "" }) {
  const course = await getCourseById(courseId);
  if (!course) throw new Error("Curso no encontrado");

  const { rows } = await getPostgresPool().query(
    `INSERT INTO enrollments
      (course_id, full_name, email, phone, message, wants_reminders, payment_status, payment_reference)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, course_id, full_name, email, phone, message, wants_reminders,
       reminder_sent_at, payment_status, payment_reference`,
    [
      course.id,
      fullName,
      email,
      phone,
      message,
      true,
      course.is_paid ? "pending_payment" : "not_required",
      null,
    ]
  );
  return rows[0];
}

export async function getEnrollmentsByCourse(courseId) {
  const numId = Number(courseId);
  const { rows } = await getPostgresPool().query(
    `SELECT id, course_id, full_name, email, phone, message, wants_reminders,
      reminder_sent_at, payment_status, payment_reference, created_at
     FROM enrollments
     WHERE course_id = $1
     ORDER BY id DESC`,
    [numId]
  );
  return rows;
}

export async function getAllEnrollments() {
  const { rows } = await getPostgresPool().query(
    `SELECT e.*, c.title AS course_title
     FROM enrollments e
     JOIN courses c ON c.id = e.course_id
     ORDER BY e.created_at DESC`
  );
  return rows;
}

export async function getEnrollmentsForReminders() {
  const { rows } = await getPostgresPool().query(
    `SELECT e.*, c.title AS course_title, c.start_date
     FROM enrollments e
     JOIN courses c ON c.id = e.course_id
     WHERE e.wants_reminders = TRUE
       AND e.reminder_sent_at IS NULL
       AND c.start_date IS NOT NULL
       AND c.start_date::date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
     ORDER BY c.start_date ASC`
  );
  return rows;
}

export async function markEnrollmentReminderSent(enrollmentId) {
  const { rows } = await getPostgresPool().query(
    `UPDATE enrollments
     SET reminder_sent_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id`,
    [Number(enrollmentId)]
  );
  return rows[0] || null;
}

export async function markReminderSent(enrollmentId) {
  return markEnrollmentReminderSent(enrollmentId);
}

export async function getUserByEmail(email) {
  const { rows } = await getPostgresPool().query(
    "SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
    [email]
  );
  return rows[0] || null;
}

export async function getUserById(id) {
  const { rows } = await getPostgresPool().query(
    `SELECT id, name, email, role, created_at, updated_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function createPasswordResetToken(userId, tokenHash, expiresAt) {
  await getPostgresPool().query(
    `UPDATE password_reset_tokens
     SET used_at = CURRENT_TIMESTAMP
     WHERE user_id = $1 AND used_at IS NULL`,
    [userId]
  );
  const { rows } = await getPostgresPool().query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id, expires_at`,
    [userId, tokenHash, expiresAt]
  );
  return rows[0];
}

export async function getValidPasswordResetToken(tokenHash) {
  const { rows } = await getPostgresPool().query(
    `SELECT *
     FROM password_reset_tokens
     WHERE token_hash = $1
       AND used_at IS NULL
       AND expires_at > CURRENT_TIMESTAMP
     LIMIT 1`,
    [tokenHash]
  );
  return rows[0] || null;
}

export async function consumePasswordResetToken(id) {
  const { rows } = await getPostgresPool().query(
    `UPDATE password_reset_tokens
     SET used_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND used_at IS NULL
     RETURNING user_id`,
    [id]
  );
  return rows[0] || null;
}

export async function updateUserPassword(id, passwordHash) {
  const { rows } = await getPostgresPool().query(
    `UPDATE users
     SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, name, email, role, created_at, updated_at`,
    [passwordHash, id]
  );
  return rows[0] || null;
}

export async function getSiteSetting(key) {
  const { rows } = await getPostgresPool().query(
    `SELECT value
     FROM site_settings
     WHERE key = $1
     LIMIT 1`,
    [key]
  );

  return rows[0]?.value ?? null;
}

export async function setSiteSetting(key, value) {
  const { rows } = await getPostgresPool().query(
    `INSERT INTO site_settings (key, value)
     VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE
       SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [key, value ?? null]
  );
  return rows[0];
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
