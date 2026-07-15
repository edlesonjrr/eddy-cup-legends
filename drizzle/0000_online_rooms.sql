CREATE TABLE IF NOT EXISTS rooms (
  code TEXT PRIMARY KEY,
  host_token TEXT NOT NULL,
  guest_token TEXT,
  host_state TEXT NOT NULL DEFAULT '{}',
  guest_state TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'waiting',
  deadline INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
