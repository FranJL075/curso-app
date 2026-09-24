# Academia Cursos — sitio de inscripción a cursos

Sitio con landing pública + catálogo de cursos + formulario de inscripción,
y un panel de administración para cargar/editar cursos y ver los inscriptos.

Construido con Next.js (App Router) + Tailwind CSS. Sin pasarela de pago
todavía, pero con el modelo de datos y el flujo ya preparados para sumarla.

## Correrlo en tu máquina

```bash
npm install
cp .env.example .env.local   # y completá ADMIN_PASSWORD / ADMIN_SESSION_SECRET
npm run seed                 # carga 2 cursos de ejemplo
npm run dev
```

Abrí http://localhost:3000 para el sitio público, y
http://localhost:3000/admin para el panel (la contraseña es la que pusiste
en `ADMIN_PASSWORD`).

## Estructura

```
app/
  page.js                     landing pública (hero + grilla de cursos)
  cursos/[slug]/page.js       detalle de curso + formulario de inscripción
  api/enroll/route.js         API pública: guarda una inscripción
  admin/
    login/page.js             login del panel
    (protected)/               todo lo de acá adentro requiere sesión de admin
      page.js                  dashboard: lista de cursos
      cursos/nuevo/page.js     alta de curso
      cursos/[id]/page.js      edición de curso + lista de inscriptos + borrar
  api/admin/...                API protegida para el CRUD de cursos

lib/
  db.js            toda la lógica de datos (cursos e inscripciones)
  auth.js          login del admin (cookie firmada, sin sesión en servidor)
  requireAdmin.js  helper para proteger las API routes de /admin

components/        UI reutilizable (Hero, CourseCard, EnrollForm, CourseForm, etc.)
scripts/seed.js     carga cursos de ejemplo
```

## ⚠️ Importante antes de desplegar en Vercel: la base de datos

Este proyecto guarda los datos en un archivo JSON. Localmente queda en
`data/db.json` (sin ninguna dependencia nativa que compilar, para que
instale sin problemas en cualquier máquina). En Vercel, como el resto del
proyecto es de solo lectura, automáticamente guarda en `/tmp` en su lugar —
así que el sitio va a andar y vas a poder probarlo, **pero cualquier curso o
inscripción que cargues ahí se puede perder** en el próximo deploy o reinicio
de la función serverless. Sirve para probar que todo funciona, no para
guardar datos reales de producción.

Para producción de verdad hay que migrar `lib/db.js` a una base de datos
hosteada:

1. Crear una base Postgres gratuita en **Vercel Postgres**, **Neon** o
   **Supabase** (cualquiera de las tres sirve, todas se conectan igual desde
   Next.js).
2. Reemplazar el contenido de `lib/db.js` para que use esa conexión en vez de
   `better-sqlite3` — ya sea con **Prisma** (más cómodo para el día a día,
   requiere correr `npx prisma generate` en tu máquina/en el deploy) o con el
   driver `pg` directo (más liviano, sin paso extra de generación).
3. Mantener **los mismos nombres y firmas de función** que ya están en
   `lib/db.js` (`getActiveCourses`, `createCourse`, `createEnrollment`,
   etc.) — el resto de la app (páginas, componentes, API routes) no necesita
   tocarse, porque todos importan de `@/lib/db` y no saben ni les importa
   qué motor de base de datos hay atrás.
4. Correr las migraciones (crear las tablas `courses` y `enrollments`, mismo
   esquema que ya está en `lib/db.js`) contra esa base antes del primer
   deploy.

## Dónde va el pago cuando lo sumes

El modelo de datos ya está preparado:

- Cada curso tiene `is_paid`, `price_cents`, `currency` (se cargan desde el
  panel admin, en el formulario de curso).
- Cada inscripción tiene `payment_status` (`not_required` / `pending_payment`
  / `paid`) y `payment_reference` para guardar el ID de la transacción.

Los dos puntos exactos donde hay que enganchar la pasarela (dejé comentarios
en el código en esos mismos lugares):

- **`app/api/enroll/route.js`**: después de guardar la inscripción de un
  curso pago, en vez de responder "listo" hay que crear la preferencia de
  pago (Mercado Pago Checkout Pro es la opción más simple para Argentina) y
  devolver la URL de pago al formulario para redirigir al usuario ahí.
- **Un nuevo endpoint `app/api/payments/webhook/route.js`**: Mercado Pago le
  pega a esa URL cuando el pago se confirma; ahí se busca la inscripción por
  `payment_reference` y se actualiza `payment_status` a `"paid"`.

## Deploy en Vercel

1. Subir el proyecto a un repo de GitHub.
2. Importarlo en Vercel (vercel.com → New Project).
3. Cargar las variables de entorno (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`,
   y la que corresponda a la base de datos una vez migrada de SQLite a
   Postgres, ver arriba).
4. Deploy. El dominio propio se agrega después desde Project Settings →
   Domains, apuntando los registros DNS que Vercel te indique.

## Importar cursos a PostgreSQL

Con `DATABASE_URL` configurada y la tabla `courses` ya creada, ejecutar una sola vez:

```bash
npm run migrate:courses
```

El script importa `lib/seedCourses.json` de forma idempotente, conserva los IDs
del archivo, no elimina datos y reajusta la secuencia de `courses.id`. Si se
ejecuta nuevamente, verifica los cursos existentes por `slug` y no los duplica.

Antes de restaurar la relación con inscripciones, verificar cursos e inscripciones
huérfanas:

```sql
SELECT id, slug, title, is_active FROM courses ORDER BY id;

SELECT e.id, e.course_id
FROM enrollments e
LEFT JOIN courses c ON c.id = e.course_id
WHERE c.id IS NULL;
```

Solo si la segunda consulta no devuelve filas, restaurar la foreign key:

```sql
ALTER TABLE enrollments
ADD CONSTRAINT enrollments_course_id_fkey
FOREIGN KEY (course_id) REFERENCES courses(id);
```
