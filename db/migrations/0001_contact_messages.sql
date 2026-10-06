CREATE TABLE IF NOT EXISTS contact_messages (
  id text PRIMARY KEY NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  topic text NOT NULL,
  message text NOT NULL,
  created_at text NOT NULL
);
