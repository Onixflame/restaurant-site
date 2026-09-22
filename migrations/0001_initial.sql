PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS demo_sessions (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS demo_menu_items (
  session_id TEXT NOT NULL,
  id INTEGER NOT NULL,
  payload TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, id),
  FOREIGN KEY (session_id) REFERENCES demo_sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS demo_reservations (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES demo_sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS demo_inquiries (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES demo_sessions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS demo_table_overrides (
  session_id TEXT NOT NULL,
  slot_key TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('available','reserved')),
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, slot_key),
  FOREIGN KEY (session_id) REFERENCES demo_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_demo_sessions_expires ON demo_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_demo_reservations_expires ON demo_reservations(expires_at);
CREATE INDEX IF NOT EXISTS idx_demo_inquiries_expires ON demo_inquiries(expires_at);
