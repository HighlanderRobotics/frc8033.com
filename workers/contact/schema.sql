CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('screening', 'held', 'pending', 'sent', 'dismissed')),
  reason TEXT,
  first_attempt_at INTEGER,
  next_attempt_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS contact_duplicate_lookup ON contact_messages (fingerprint, created_at);
CREATE INDEX IF NOT EXISTS contact_work_lookup ON contact_messages (status, next_attempt_at);
CREATE INDEX IF NOT EXISTS contact_retention_lookup ON contact_messages (created_at);
