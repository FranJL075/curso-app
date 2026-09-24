CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(320) NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'admin' CHECK (role = 'admin'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS courses (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'General',
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  modality TEXT NOT NULL DEFAULT 'Presencial',
  includes TEXT NOT NULL DEFAULT '',
  requirements TEXT NOT NULL DEFAULT '',
  payment TEXT NOT NULL DEFAULT '',
  price_label TEXT NOT NULL DEFAULT '',
  start_date DATE,
  spots INTEGER,
  image_url TEXT,
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  price_cents INTEGER,
  currency VARCHAR(10) NOT NULL DEFAULT 'ARS',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  message VARCHAR(1000) NOT NULL DEFAULT '',
  wants_reminders BOOLEAN NOT NULL DEFAULT FALSE,
  reminder_sent_at TIMESTAMPTZ,
  payment_status VARCHAR(30) NOT NULL DEFAULT 'not_required',
  payment_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS enrollments_course_id_idx ON enrollments (course_id);
CREATE INDEX IF NOT EXISTS enrollments_reminders_idx ON enrollments (wants_reminders, reminder_sent_at);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS password_reset_tokens_user_idx ON password_reset_tokens (user_id);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
