// ============================================================
// server.js
// A very small Express server for a simple LMS.
// No JWT, no OAuth, no password hashing - this is a beginner project.
// ============================================================

const express = require('express');
const session = require('express-session');
const path = require('path');

const database = require('./database');
const db = database.db;
const logEvent = database.logEvent;

const app = express();
const PORT = 3000;

// ------------------------------------------------------------
// 1) Create the database tables (runs automatically on first start)
// ------------------------------------------------------------
database.initDatabase();

// ------------------------------------------------------------
// 2) Middleware
// ------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'simple-lms-secret',
    resave: false,
    saveUninitialized: false
  })
);

// CSS and JavaScript files live in the public folder
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------------
// 3) Our two users (hardcoded in an array, exactly as asked)
// ------------------------------------------------------------
const USERS = [
  { username: 'student1', password: '123' },
  { username: 'student2', password: '123' }
];

// ------------------------------------------------------------
// 4) Course content (kept in plain JavaScript objects)
// ------------------------------------------------------------
const COURSE = {
  id: 1,
  title: 'Introduction to Learning Analytics',
  description:
    'A short beginner course that explains what learning analytics is and how clickstream data is collected and used.'
};

const LESSONS = [
  {
    id: 1,
    title: 'What is Learning Analytics?',
    videoId: 'aircAruvnKk',
    videoTitle: '3Blue1Brown - But what is a neural network?',
    reading:
      'Learning Analytics is the measurement, collection, analysis and reporting of data about learners ' +
      'and their contexts. The goal is to understand how students learn and to improve the learning ' +
      'environment. Every time a learner opens a page, plays a video or answers a quiz question, that ' +
      'small action can be stored as data. When we collect thousands of these small actions we can start ' +
      'to see patterns: which lessons are confusing, which videos students re-watch, and which learners ' +
      'may need help. Teachers can then use these patterns to change the way they teach, and students ' +
      'can use their own dashboards to see how much they have completed.'
  },
  {
    id: 2,
    title: 'Clickstream Data',
    videoId: 'Gv9_4yMHFhI',
    videoTitle: 'StatQuest - A Gentle Introduction to Machine Learning',
    reading:
      'Clickstream data is the trail of actions a user leaves behind while using a website or an app. ' +
      'Each action becomes one row in a table. A typical row stores the time, who did it, where it ' +
      'happened (the context), which part of the system was involved (the component), what happened ' +
      '(the event name), a short description, the origin (web or mobile) and the IP address. ' +
      'Moodle, the learning platform used by many universities, stores its logs in exactly this shape. ' +
      'This project copies that idea: every click, page view, video play and quiz answer in this app is ' +
      'written into a SQLite table called clickstream, and you can view it on the Logs page.'
  }
];

const QUIZ = [
  {
    id: 1,
    question: 'What is clickstream data?',
    options: [
      'A record of the actions a user performs in an app',
      'A type of computer mouse',
      'A video streaming service',
      'A programming language'
    ],
    answer: 0
  },
  {
    id: 2,
    question: 'Which of these is NOT usually stored in a Moodle style log row?',
    options: ['Timestamp', 'Event name', 'IP address', 'The user password'],
    answer: 3
  },
  {
    id: 3,
    question: 'What is the main goal of Learning Analytics?',
    options: [
      'To sell products to students',
      'To understand and improve learning',
      'To make websites load faster',
      'To design better logos'
    ],
    answer: 1
  },
  {
    id: 4,
    question: 'In this app, where is the clickstream data stored?',
    options: ['In a text file', 'In a SQLite database', 'In the browser only', 'It is not stored'],
    answer: 1
  },
  {
    id: 5,
    question: 'Which of these is an example of a clickstream event?',
    options: ['Video played', 'Quiz submitted', 'Course viewed', 'All of the above'],
    answer: 3
  }
];

// ------------------------------------------------------------
// 5) Small helper: block pages if the user is not logged in
// ------------------------------------------------------------
function requireLogin(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.redirect('/');
  }
}

// Short helper so we do not repeat req.ip everywhere
function log(req, context, component, eventName, description) {
  const username = req.session && req.session.username ? req.session.username : 'guest';
  logEvent(username, context, component, eventName, description, req.ip);
}

// ------------------------------------------------------------
// 6) Page routes
// ------------------------------------------------------------

// Login page (also the home page of the site)
app.get('/', function (req, res) {
  if (req.session && req.session.username) {
    return res.redirect('/home');
  }
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/home', requireLogin, function (req, res) {
  log(req, 'Site: Simple LMS', 'System', 'Page viewed', 'The user "' + req.session.username + '" viewed the home page.');
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/course', requireLogin, function (req, res) {
  log(
    req,
    'Course: ' + COURSE.title,
    'System',
    'Course viewed',
    'The user "' + req.session.username + '" viewed the course with id ' + COURSE.id + '.'
  );
  res.sendFile(path.join(__dirname, 'views', 'course.html'));
});

app.get('/lesson1', requireLogin, function (req, res) {
  openLesson(req, 1);
  res.sendFile(path.join(__dirname, 'views', 'lesson1.html'));
});

app.get('/lesson2', requireLogin, function (req, res) {
  openLesson(req, 2);
  res.sendFile(path.join(__dirname, 'views', 'lesson2.html'));
});

app.get('/quiz', requireLogin, function (req, res) {
  log(
    req,
    'Quiz: Learning Analytics Quiz',
    'Quiz',
    'Quiz started',
    'The user "' + req.session.username + '" started the quiz.'
  );
  res.sendFile(path.join(__dirname, 'views', 'quiz.html'));
});

app.get('/progress', requireLogin, function (req, res) {
  log(
    req,
    'Course: ' + COURSE.title,
    'System',
    'Progress page viewed',
    'The user "' + req.session.username + '" viewed the progress page.'
  );
  res.sendFile(path.join(__dirname, 'views', 'progress.html'));
});

app.get('/logs', requireLogin, function (req, res) {
  log(
    req,
    'Course: ' + COURSE.title,
    'Logs',
    'Log report viewed',
    'The user "' + req.session.username + '" viewed the log report for the course with id ' + COURSE.id + '.'
  );
  res.sendFile(path.join(__dirname, 'views', 'logs.html'));
});

// Marks the lesson as opened (progress) and writes a log row
function openLesson(req, lessonId) {
  const lesson = LESSONS[lessonId - 1];
  log(
    req,
    'Lesson: ' + lesson.title,
    'Lesson',
    'Lesson opened',
    'The user "' + req.session.username + '" opened lesson ' + lessonId + ' (' + lesson.title + ').'
  );
  saveProgress(req.session.username, 'lesson', 'lesson' + lessonId);
}

// Saves one progress row. UNIQUE in the table stops duplicates.
function saveProgress(username, itemType, itemKey) {
  db.run(
    `INSERT OR IGNORE INTO progress (username, item_type, item_key, timestamp)
     VALUES (?, ?, ?, ?)`,
    [username, itemType, itemKey, database.makeTimestamp()],
    function (err) {
      if (err) console.log('Could not save progress:', err.message);
    }
  );
}

// ------------------------------------------------------------
// 7) Login / Logout
// ------------------------------------------------------------
app.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // Simple search through the array. No hashing, no encryption.
  let found = null;
  for (let i = 0; i < USERS.length; i++) {
    if (USERS[i].username === username && USERS[i].password === password) {
      found = USERS[i];
    }
  }

  if (found) {
    req.session.username = found.username;
    logEvent(found.username, 'Site: Simple LMS', 'System', 'User logged in', 'The user "' + found.username + '" logged in.', req.ip);
    res.json({ ok: true });
  } else {
    logEvent(username || 'unknown', 'Site: Simple LMS', 'System', 'Login failed', 'A login attempt failed for username "' + (username || 'unknown') + '".', req.ip);
    res.json({ ok: false, message: 'Wrong username or password' });
  }
});

app.get('/logout', function (req, res) {
  if (req.session && req.session.username) {
    logEvent(req.session.username, 'Site: Simple LMS', 'System', 'User logged out', 'The user "' + req.session.username + '" logged out.', req.ip);
  }
  req.session.destroy(function () {
    res.redirect('/');
  });
});

// ------------------------------------------------------------
// 8) Small API used by the pages
// ------------------------------------------------------------

// Who am I? (used to show the username in the navbar)
app.get('/api/me', requireLogin, function (req, res) {
  res.json({ username: req.session.username });
});

// The course + lesson content
app.get('/api/course', requireLogin, function (req, res) {
  res.json({ course: COURSE, lessons: LESSONS });
});

// Any event coming from the browser (clicks, video actions, page views...)
app.post('/api/log', requireLogin, function (req, res) {
  const body = req.body || {};
  const context = body.context || 'Site: Simple LMS';
  const component = body.component || 'System';
  const eventName = body.eventName || 'Unknown event';
  const description = body.description || 'No description.';

  log(req, context, component, eventName, description);

  // A finished video also counts as progress
  if (eventName === 'Video ended' && body.videoKey) {
    saveProgress(req.session.username, 'video', body.videoKey);
  }

  res.json({ ok: true });
});

// The quiz questions (the correct answers are removed before sending)
app.get('/api/quiz', requireLogin, function (req, res) {
  const safeQuestions = QUIZ.map(function (q) {
    return { id: q.id, question: q.question, options: q.options };
  });
  res.json(safeQuestions);
});

// Marking the quiz
app.post('/api/quiz/submit', requireLogin, function (req, res) {
  const answers = req.body.answers || {};
  let score = 0;

  for (let i = 0; i < QUIZ.length; i++) {
    const q = QUIZ[i];
    const given = answers[q.id];
    if (given !== undefined && given !== null && Number(given) === q.answer) {
      score = score + 1;
    }
  }

  db.run(
    `INSERT INTO quiz_attempts (username, score, total, timestamp) VALUES (?, ?, ?, ?)`,
    [req.session.username, score, QUIZ.length, database.makeTimestamp()],
    function (err) {
      if (err) console.log('Could not save quiz attempt:', err.message);
    }
  );

  log(
    req,
    'Quiz: Learning Analytics Quiz',
    'Quiz',
    'Quiz submitted',
    'The user "' + req.session.username + '" submitted the quiz and scored ' + score + ' out of ' + QUIZ.length + '.'
  );

  res.json({ score: score, total: QUIZ.length });
});

// All clickstream rows, newest first (used by the Logs page)
app.get('/api/logs', requireLogin, function (req, res) {
  db.all('SELECT * FROM clickstream ORDER BY id DESC', [], function (err, rows) {
    if (err) {
      console.log('Could not read logs:', err.message);
      return res.json([]);
    }
    res.json(rows);
  });
});

// Numbers for the Progress page
app.get('/api/progress', requireLogin, function (req, res) {
  const username = req.session.username;

  db.all(
    'SELECT item_type, item_key FROM progress WHERE username = ?',
    [username],
    function (err, rows) {
      if (err) rows = [];

      let lessons = 0;
      let videos = 0;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].item_type === 'lesson') lessons = lessons + 1;
        if (rows[i].item_type === 'video') videos = videos + 1;
      }

      db.get(
        'SELECT MAX(score) AS best, COUNT(*) AS attempts FROM quiz_attempts WHERE username = ?',
        [username],
        function (err2, row) {
          if (err2 || !row) row = { best: null, attempts: 0 };

          db.get(
            'SELECT COUNT(*) AS total FROM clickstream WHERE username = ?',
            [username],
            function (err3, row3) {
              if (err3 || !row3) row3 = { total: 0 };

              res.json({
                username: username,
                lessonsCompleted: lessons,
                totalLessons: LESSONS.length,
                videosWatched: videos,
                totalVideos: LESSONS.length,
                quizScore: row.best === null ? 0 : row.best,
                quizTotal: QUIZ.length,
                quizAttempts: row.attempts,
                totalEvents: row3.total
              });
            }
          );
        }
      );
    }
  );
});

// ------------------------------------------------------------
// 9) Anything else -> back to the login page
// ------------------------------------------------------------
app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// ------------------------------------------------------------
// 10) Start the server
// ------------------------------------------------------------
app.listen(PORT, function () {
  console.log('----------------------------------------------');
  console.log('  Simple LMS is running!');
  console.log('  Open your browser at: http://localhost:' + PORT);
  console.log('  Login with student1 / 123  or  student2 / 123');
  console.log('----------------------------------------------');
});
