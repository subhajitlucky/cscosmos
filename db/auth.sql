CREATE TABLE IF NOT EXISTS cscosmos_users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS cscosmos_login_tokens (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cscosmos_login_tokens_email_idx
  ON cscosmos_login_tokens (email);

CREATE TABLE IF NOT EXISTS cscosmos_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES cscosmos_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cscosmos_sessions_user_idx
  ON cscosmos_sessions (user_id);

CREATE TABLE IF NOT EXISTS cscosmos_learning (
  user_id BIGINT PRIMARY KEY REFERENCES cscosmos_users(id) ON DELETE CASCADE,
  bookmarks TEXT[] NOT NULL DEFAULT '{}',
  completed TEXT[] NOT NULL DEFAULT '{}',
  visited JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


ALTER TABLE cscosmos_users
  ADD COLUMN IF NOT EXISTS leaderboard_opt_in BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS cscosmos_certificates (
  id UUID PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES cscosmos_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed_count INTEGER NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cscosmos_certificates_user_idx
  ON cscosmos_certificates (user_id);

CREATE TABLE IF NOT EXISTS cscosmos_comments (
  id UUID PRIMARY KEY,
  topic_slug TEXT NOT NULL,
  user_id BIGINT NOT NULL REFERENCES cscosmos_users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cscosmos_comments_topic_idx
  ON cscosmos_comments (topic_slug, created_at);
