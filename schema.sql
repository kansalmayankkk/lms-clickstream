-- ============================================================
-- Database schema for the simple LMS
-- This file runs automatically the first time you start the app
-- ============================================================

-- 1) The clickstream table (looks like a Moodle log report)
CREATE TABLE IF NOT EXISTS clickstream (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp     TEXT NOT NULL,
  username      TEXT NOT NULL,
  event_context TEXT NOT NULL,
  component     TEXT NOT NULL,
  event_name    TEXT NOT NULL,
  description   TEXT NOT NULL,
  origin        TEXT NOT NULL,
  ip_address    TEXT NOT NULL
);

-- 2) Quiz attempts (one row every time a learner submits the quiz)
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  username  TEXT NOT NULL,
  score     INTEGER NOT NULL,
  total     INTEGER NOT NULL,
  timestamp TEXT NOT NULL
);

-- 3) Progress (which lessons were opened, which videos were finished)
--    item_type is 'lesson' or 'video'
CREATE TABLE IF NOT EXISTS progress (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  username  TEXT NOT NULL,
  item_type TEXT NOT NULL,
  item_key  TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  UNIQUE (username, item_type, item_key)
);
