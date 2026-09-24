# Academia Cursos

Aplicación de cursos con Next.js App Router, catálogo público, inscripciones y panel administrativo.

## Desarrollo local

1. Instala dependencias:

```bash
npm install
```

2. Copia `.env.example` a `.env.local` y completa `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `ADMIN_EMAIL` y `ADMIN_INITIAL_PASSWORD`.

3. Inicializa PostgreSQL y carga cursos y el primer administrador:

```bash
npm run migrate
npm run seed
```

4. Ejecuta la aplicación:

```bash
npm run dev
```

## Base de datos

La aplicación usa PostgreSQL mediante `pg`. El esquema está en `db/schema.sql` y se crea con `npm run migrate`. El seed es idempotente: agrega los cursos que no existan y crea el administrador indicado en las variables de entorno sin sobrescribirlo.

Tablas principales:

- `users`: cuentas de administradores y hashes bcrypt.
- `courses`: cursos, imágenes y fechas.
- `enrollments`: inscripciones, preferencias de recordatorio y estado de pago.
- `password_reset_tokens`: tokens hasheados, de un solo uso y con expiración.
- `site_settings`: configuración editable como `courses_banner_url`.

La aplicación conserva las funciones de acceso a cursos e inscripciones en `lib/db.js`, pero ahora son asíncronas porque consultan PostgreSQL.

## Variables de entorno

- `DATABASE_URL`: conexión PostgreSQL de producción.
- `ADMIN_SESSION_SECRET`: secreto largo y aleatorio para cookies de sesión.
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`: datos usados por `npm run seed` para crear el primer administrador.
- `APP_URL`: URL pública, usada para generar enlaces de recuperación.
- `RESEND_API_KEY`: API key de Resend.
- `EMAIL_FROM`: remitente verificado en Resend, por ejemplo `Academia <noreply@tu-dominio.com>`.
- `CRON_SECRET`: secreto que protege el endpoint de recordatorios.

No se requieren `ADMIN_PASSWORD` ni contraseñas guardadas en archivos. `.env*` está excluido de Git.

## Vercel

Configura todas las variables anteriores en Project Settings > Environment Variables. Usa una base PostgreSQL administrada por Neon, Supabase o Vercel Postgres. Después de configurar `DATABASE_URL`, ejecuta desde un entorno con acceso a la base:

```bash
npm run migrate
npm run seed
```

`vercel.json` programa `/api/cron/reminders` una vez por día. Vercel envía el encabezado `Authorization: Bearer <CRON_SECRET>` al endpoint.

Para emails, crea una cuenta en Resend, verifica el dominio del remitente y configura `RESEND_API_KEY` y `EMAIL_FROM`. Sin esas variables, las inscripciones siguen guardándose, pero no se envían emails.

## Funcionalidades administrativas

- `/admin/login`: acceso con email y contraseña individual.
- `/admin/cuenta`: cambio de contraseña validando la contraseña actual.
- `/admin/forgot-password`: recuperación con respuesta genérica para no revelar cuentas.
- `/admin/reset-password`: restablecimiento mediante token de un solo uso.
- `/admin/configuracion`: URL del banner principal de cursos.
- Alta y edición de cursos: URL de imagen con vista previa.
- Inscripciones: preferencia de recibir recordatorios por email.

## Pruebas manuales

- Login: crea el primer administrador con `npm run seed` y entra en `/admin/login`.
- Cambio de contraseña: entra en `/admin/cuenta`, usa la contraseña actual y vuelve a iniciar sesión.
- Recuperación: configura Resend, solicita el enlace en `/admin/forgot-password` y abre la URL recibida.
- Cursos e imágenes: crea o edita un curso desde el panel, pega una URL de imagen y comprueba la tarjeta y el detalle público.
- Banner: cambia la URL en `/admin/configuracion` y revisa la portada.
- Inscripción: completa el formulario público y marca la preferencia de recordatorios.
- Emails: verifica el email de confirmación; el cron puede probarse con `GET /api/cron/reminders` usando `Authorization: Bearer <CRON_SECRET>`.

## Comandos

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
