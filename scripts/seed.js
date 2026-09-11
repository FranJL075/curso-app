const path = require("path");
const fs = require("fs");

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_PATH = path.join(DATA_DIR, "db.json");
const seedCourses = require("../lib/seedCourses.json");

const courses = seedCourses.map((course, index) => ({
  ...course,
  id: index + 1,
  created_at: new Date().toISOString(),
}));

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.writeFileSync(
  DATA_PATH,
  JSON.stringify(
    { courses, enrollments: [], nextCourseId: courses.length + 1, nextEnrollmentId: 1 },
    null,
    2
  )
);

console.log(`Seed listo: ${courses.length} cursos de ejemplo cargados en ${DATA_PATH}`);
