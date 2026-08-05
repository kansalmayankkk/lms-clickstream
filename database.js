// ============================================================
// database.js
// Opens the SQLite database and creates the tables on first run.
// Everything here is kept as simple as possible.
// ============================================================

const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

// The database file will be created next to this file (lms.db)
const dbFile = path.join(__dirname, 'lms.db');

// Open (or create) the database
const db = new sqlite3.Database(dbFile);

// Read schema.sql and run it. "CREATE TABLE IF NOT EXISTS" means
// this is safe to run every single time the server starts.
function initDatabase() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema, function (err) {
    if (err) {
      console.log('Error creating tables:', err.message);
    } else {
      console.log('Database ready ->', dbFile);
    }
  });
}

// ------------------------------------------------------------
// THE MOST IMPORTANT FUNCTION OF THIS PROJECT
// logEvent() saves one row of clickstream data.
// ------------------------------------------------------------
function logEvent(username, context, component, eventName, description, ip) {
  const timestamp = makeTimestamp();
  const origin = 'web';
  const ipAddress = cleanIp(ip);

  db.run(
    `INSERT INTO clickstream
       (timestamp, username, event_context, component, event_name, description, origin, ip_address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [timestamp, username, context, component, eventName, description, origin, ipAddress],
    function (err) {
      if (err) {
        console.log('Could not save log:', err.message);
      }
    }
  );
}

// Makes a Moodle style time string like  5/08/26, 02:57:25
function makeTimestamp() {
  const d = new Date();
  const two = (n) => (n < 10 ? '0' + n : '' + n);
  const day = d.getDate();
  const month = two(d.getMonth() + 1);
  const year = two(d.getFullYear() % 100);
  const time = two(d.getHours()) + ':' + two(d.getMinutes()) + ':' + two(d.getSeconds());
  return day + '/' + month + '/' + year + ', ' + time;
}

// On localhost Express gives us "::1" which looks strange in a report,
// so we turn it into a normal looking IP address.
function cleanIp(ip) {
  if (!ip) return '127.0.0.1';
  if (ip === '::1') return '127.0.0.1';
  if (ip.indexOf('::ffff:') === 0) return ip.replace('::ffff:', '');
  return ip;
}

module.exports = {
  db: db,
  initDatabase: initDatabase,
  logEvent: logEvent,
  makeTimestamp: makeTimestamp
};
