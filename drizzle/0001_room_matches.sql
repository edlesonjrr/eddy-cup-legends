CREATE TABLE IF NOT EXISTS room_matches (
  code TEXT PRIMARY KEY,
  state TEXT NOT NULL DEFAULT '{}',
  host_decision TEXT NOT NULL DEFAULT '{}',
  guest_decision TEXT NOT NULL DEFAULT '{}',
  updated_at INTEGER NOT NULL
);
