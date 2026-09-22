CREATE TABLE IF NOT EXISTS demo_guest_accounts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  profile TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_demo_guest_accounts_email ON demo_guest_accounts(email);
CREATE INDEX IF NOT EXISTS idx_demo_guest_accounts_expires ON demo_guest_accounts(expires_at);
