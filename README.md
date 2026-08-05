# Simple LMS with Clickstream Tracking

**Course:** Learning Analytics and Educational Data Mining
**Assignment 1:** Build a learning application that records learner clickstream data

---

## 1. Project Description

This project is a very small **Learning Management System (LMS)** built with Node.js, Express and
SQLite.

A learner logs in, opens a course, reads the lesson material, watches YouTube videos and takes a
quiz. **Every single interaction is recorded into a clickstream table in the database**, in exactly
the same shape as a Moodle log report:

| Time | Event context | Component | Event name | Description | Origin | IP address |
|------|---------------|-----------|------------|-------------|--------|------------|
| 5/08/26, 15:14:24 | Course: Introduction to Learning Analytics | Logs | Log report viewed | The user "student2" viewed the log report for the course with id 1. | web | 127.0.0.1 |

The learner can then see all of that data on the **Logs** page and see a summary of it on the
**Progress** page.

---

## 2. Features

**Learning application**

- Login page (2 hardcoded learner accounts)
- Home page
- Course page (1 course: *Introduction to Learning Analytics*)
- Lesson 1 – *What is Learning Analytics?* (reading + 3Blue1Brown video)
- Lesson 2 – *Clickstream Data* (reading + StatQuest video)
- Quiz with 5 multiple-choice questions and automatic scoring
- Progress page with simple numbers
- Logs page (the clickstream dashboard)

**Clickstream tracking** — the following events are recorded:

| Event name | When it happens |
|---|---|
| User logged in | Successful login |
| Login failed | Wrong username or password |
| User logged out | Clicking Logout |
| Page viewed | Opening the home page |
| Course viewed | Opening the course page |
| Lesson opened | Opening lesson 1 or 2 |
| Reading opened | The reading material of a lesson is displayed |
| Video played | Pressing play on the YouTube player |
| Video paused | Pausing the video |
| Video ended | Finishing the video (or clicking "Mark video as watched") |
| Quiz started | Opening the quiz page |
| Quiz answer selected | Clicking any option A/B/C/D |
| Quiz submitted | Submitting the quiz (the score is stored too) |
| Progress page viewed | Opening the progress page |
| Log report viewed | Opening the logs page |
| Button clicked | Clicking any button |
| Link clicked | Clicking any link |

---

## 3. Technology Used

| Part | Technology |
|---|---|
| Server | Node.js + Express |
| Database | SQLite (`sqlite3` package) |
| Sessions | `express-session` |
| Frontend | Plain HTML, plain CSS, plain JavaScript |
| Video | YouTube IFrame Player API (to catch play / pause / ended) |
| Version control | Git |

No JWT, no password hashing, no TypeScript, no frameworks, no Docker — this is deliberately kept
simple and beginner friendly.

---

## 4. Folder Structure

```
lms-clickstream/
│
├── server.js              Express server + all routes
├── database.js            Opens SQLite, creates tables, logEvent() helper
├── schema.sql             The 3 database tables
├── package.json           Dependencies and the "npm start" script
├── .gitignore
├── README.md
├── DEMO_SCRIPT.md         5 minute demo video script
├── PRESENTATION.md        10 slide presentation
│
├── views/                 All HTML pages
│   ├── login.html
│   ├── home.html
│   ├── course.html
│   ├── lesson1.html
│   ├── lesson2.html
│   ├── quiz.html
│   ├── progress.html
│   ├── logs.html
│   └── 404.html
│
├── public/                Files the browser can download directly
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── clickstream.js   the logEvent() helper used by every page
│       ├── video.js         YouTube play / pause / ended tracking
│       ├── quiz.js          quiz logic
│       ├── progress.js      progress numbers
│       └── logs.js          the log table
│
├── screenshots/           Screenshots for this README
│
└── lms.db                 Created automatically on the first run
```

---

## 5. Installation

You need **Node.js** installed (version 16 or newer). Check it with:

```bash
node --version
```

Then:

```bash
git clone https://github.com/kansalmayankkk/lms-clickstream.git
cd lms-clickstream
npm install
```

---

## 6. How to Run

```bash
npm start
```

You will see:

```
----------------------------------------------
  Simple LMS is running!
  Open your browser at: http://localhost:3000
  Login with student1 / 123  or  student2 / 123
----------------------------------------------
Database ready -> .../lms.db
```

Now open **http://localhost:3000** in your browser.

**Login details**

| Username | Password |
|---|---|
| student1 | 123 |
| student2 | 123 |

To stop the server press `Ctrl + C` in the terminal.

---

## 7. Database

The database file `lms.db` is created **automatically** the first time you run the app — you do not
have to create it or run any SQL by hand.

### Table `clickstream`

| Column | Type | Meaning |
|---|---|---|
| id | INTEGER | Auto number |
| timestamp | TEXT | e.g. `5/08/26, 15:14:24` |
| username | TEXT | Who did it |
| event_context | TEXT | Where it happened (course / lesson / quiz) |
| component | TEXT | System, Lesson, Video, Quiz, Logs |
| event_name | TEXT | Course viewed, Video played, ... |
| description | TEXT | A sentence describing the event |
| origin | TEXT | Always `web` |
| ip_address | TEXT | `127.0.0.1` when running locally |

### Table `quiz_attempts`

| Column | Meaning |
|---|---|
| id | Auto number |
| username | Who took the quiz |
| score | How many correct |
| total | Out of how many |
| timestamp | When |

### Table `progress`

| Column | Meaning |
|---|---|
| id | Auto number |
| username | Learner |
| item_type | `lesson` or `video` |
| item_key | `lesson1`, `lesson2`, `lesson1-video`, `lesson2-video` |
| timestamp | When it was completed |

### Looking at the data yourself

Easiest way is the **Logs** page inside the app. If you want raw SQL:

```bash
sqlite3 lms.db "SELECT * FROM clickstream ORDER BY id DESC LIMIT 10;"
```

To start again with an empty database, just delete `lms.db` and run `npm start` again.

---

## 8. Screenshots

| Page | Screenshot |
|---|---|
| Login | `screenshots/login.png` |
| Home | `screenshots/home.png` |
| Course | `screenshots/course.png` |
| Lesson with video | `screenshots/lesson.png` |
| Quiz | `screenshots/quiz.png` |
| Progress | `screenshots/progress.png` |
| Logs (clickstream) | `screenshots/logs.png` |

*(Take these screenshots while the app is running and save them into the `screenshots/` folder.)*

---

## 9. Git Commands Used

```bash
git init
git add .
git commit -m "Initial project setup"
# ... more commits ...

git branch -M main
git remote add origin https://github.com/kansalmayankkk/lms-clickstream.git
git push -u origin main
```

Commit history of this project:

```
Initial project setup
Add login page and hardcoded users
Add home and course pages
Add lesson pages with reading material and videos
Add quiz with 5 questions
Implement clickstream logging into SQLite
Add logs dashboard page
Add progress page
Finish README, demo script and presentation
```

---

## 10. Author

Built as Assignment 1 for the Learning Analytics and Educational Data Mining course.
