# Presentation — 10 Slides

*(Speaker notes are under each slide. Keep the slides light and talk from the notes.)*

---

## Slide 1 — Title

# Simple LMS with Clickstream Tracking
### Assignment 1 — Learning Analytics and Educational Data Mining

Name: ______________
Roll number: ______________
Date: August 2026

**Notes:** Introduce yourself and say in one line what you built: a small learning app that records
everything the learner does.

---

## Slide 2 — Problem

## The Problem

- Teachers only see the **final marks**, not *how* students learned
- They cannot see who is struggling until it is too late
- Which lesson did students skip? Which video did they replay?
- Learning platforms hold this information, but only if the interactions are **captured**

**Notes:** A quiz score of 6/10 tells you nothing about *why*. The clicks in between are where the
story is.

---

## Slide 3 — Objective

## Objective

1. Build a working learning application where users log in as learners
2. Provide interactive content: reading material, videos and a quiz
3. **Record every user interaction** (clicks, page views, video actions, quiz attempts)
4. Store this clickstream data in a database, in Moodle log format
5. Show the data back in a dashboard and a progress page

**Notes:** Point out that the third point is the real assignment; the app is the vehicle for it.

---

## Slide 4 — Tech Stack

## Technology Used

| Layer | Choice | Why |
|---|---|---|
| Server | Node.js + Express | Simple, few lines of code |
| Database | SQLite | One file, zero setup |
| Frontend | Plain HTML / CSS / JS | Easy to read and explain |
| Video | YouTube IFrame API | Gives play / pause / ended events |
| Version control | Git + GitHub | Required for submission |

Deliberately **no** JWT, no hashing, no frameworks — the focus is the data, not the plumbing.

**Notes:** Say you chose the simplest possible stack so all the effort went into the tracking.

---

## Slide 5 — The Application

## The Application

- **Login** — 2 hardcoded learners (student1 / student2)
- **Home** and **Course** — one course: *Introduction to Learning Analytics*
- **Lesson 1** — What is Learning Analytics? (reading + 3Blue1Brown video)
- **Lesson 2** — Clickstream Data (reading + StatQuest video)
- **Quiz** — 5 multiple choice questions, auto-scored
- **Progress** — lessons completed, videos watched, quiz score
- **Logs** — the full clickstream table

**Notes:** Put a screenshot of the course page here if you have room.

---

## Slide 6 — Clickstream

## What We Capture

| | |
|---|---|
| User logged in / out | Login failed |
| Page viewed | Course viewed |
| Lesson opened | Reading opened |
| Video played | Video paused |
| Video ended | Quiz started |
| Quiz answer selected | Quiz submitted |
| Progress page viewed | Log report viewed |
| Button clicked | Link clicked |

One helper function does all of it:

```js
logEvent(username, context, component, eventName, description, ip)
```

**Notes:** Emphasise that every page in the app calls this one function — that is the whole design.

---

## Slide 7 — Database

## Database (SQLite)

**Table: `clickstream`** — same columns as a Moodle log export

`id · timestamp · username · event_context · component · event_name · description · origin · ip_address`

Supporting tables:

- `quiz_attempts` — username, score, total, timestamp
- `progress` — username, item_type (lesson/video), item_key

The database is created **automatically** on first run from `schema.sql`.

**Notes:** Show one real row from your Logs page as an example.

---

## Slide 8 — Demo

## Live Demo

1. Login as `student1`
2. Open the course → Lesson 1 → play and pause the video
3. Take the quiz and submit
4. Open the Progress page
5. Open the Logs page — **every action from steps 1–4 is already there**

**Notes:** This is the slide you leave up while you switch to the browser or play the demo video.

---

## Slide 9 — Challenges

## Challenges and What I Learned

- **Catching video events** — a normal embedded YouTube video tells you nothing; I had to use the
  YouTube IFrame Player API and listen to `onStateChange`
- **Avoiding duplicate rows** — a `UNIQUE` constraint in the progress table so re-opening a lesson
  does not count twice
- **Designing the log format** — deciding what counts as *context* vs *component* vs *event name*
- **Keeping it simple** — resisting the urge to add login security and frameworks that the
  assignment did not need
- Learned how much a platform can infer from very small actions, and the privacy responsibility
  that comes with that

**Notes:** Be honest here — examiners like a real challenge more than a perfect story.

---

## Slide 10 — Conclusion

## Conclusion

- A working LMS with interactive content: reading, videos and a quiz
- **Every learner interaction is captured** and stored in Moodle log format
- The data is visible in a logs dashboard and summarised on a progress page
- Simple stack, fully working after `npm install` and `npm start`

**Possible future work:** charts of activity over time, teacher dashboard, at-risk student
detection, CSV export of the clickstream.

**Thank you — questions?**

GitHub: `https://github.com/<your-username>/lms-clickstream`
