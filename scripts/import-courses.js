const { loadEnvConfig } = require("@next/env");
const { Pool } = require("pg");
const seedCourses = require("../lib/seedCourses.json");

loadEnvConfig(process.cwd());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function courseValues(course, id) {
  return [
    id,
    course.category || "General",
    course.slug,
    course.title,
    course.summary,
    course.description,
    course.duration,
    course.modality || course.duration || "Presencial",
    course.includes || "",
    course.requirements || "",
    course.payment || "",
    course.price_label || "",
    course.start_date || null,
    course.spots === undefined || course.spots === null || course.spots === ""
      ? null
      : Number(course.spots),
    course.image_url || null,
    Boolean(course.is_paid),
    course.price_cents === undefined || course.price_cents === null || course.price_cents === ""
      ? null
      : Number(course.price_cents),
    course.currency || "ARS",
    course.is_active === undefined ? true : Boolean(course.is_active),
  ];
}

async function importCourses() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no está configurada.");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "CREATE UNIQUE INDEX IF NOT EXISTS courses_slug_unique_idx ON courses (slug)"
    );

    for (const [index, course] of seedCourses.entries()) {
      const id = index + 1;
      const { rows } = await client.query(
        "SELECT id, slug FROM courses WHERE slug = $1 OR id = $2",
        [course.slug, id]
      );
      const existingBySlug = rows.find((row) => row.slug === course.slug);
      const existingById = rows.find((row) => row.id === id);

      if (existingBySlug && existingBySlug.id !== id) {
        throw new Error(
          `El slug ${course.slug} ya existe con id ${existingBySlug.id}; se detiene la importación para no alterar relaciones.`
        );
      }
      if (existingById && !existingBySlug) {
        throw new Error(
          `El id ${id} ya pertenece a otro slug; se detiene la importación para no alterar relaciones.`
        );
      }
      if (existingBySlug || existingById) continue;

      await client.query(
        `INSERT INTO courses
          (id, category, slug, title, summary, description, duration, modality,
           includes, requirements, payment, price_label, start_date, spots,
           image_url, is_paid, price_cents, currency, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
           $14, $15, $16, $17, $18, $19)`,
        courseValues(course, id)
      );
    }

    await client.query(
      `SELECT setval(
        pg_get_serial_sequence('courses', 'id'),
        COALESCE(MAX(id), 1),
        COUNT(*) > 0
      ) FROM courses`
    );
    await client.query("COMMIT");
    console.log(`Importación completada: ${seedCourses.length} cursos verificados.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

importCourses().catch((error) => {
  console.error("No se pudo importar cursos:", error.message);
  process.exitCode = 1;
});