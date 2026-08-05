# 5 Minute Demo Video Script

**Total time: about 5 minutes.** Record your screen (OBS Studio, Zoom, or the built-in screen
recorder) and read this out while you click.

Before you start recording:

1. Delete `lms.db` so the log table starts empty (this looks much better in the demo).
2. Run `npm start`.
3. Open `http://localhost:3000` in the browser.
4. Have the terminal visible somewhere at the start.

---

## 0:00 – 0:30 — Introduction

**Say:**

> Hello, my name is ______. This is my submission for Assignment 1 of the Learning Analytics course.
> I have built a small Learning Management System where learners log in, read lessons, watch videos
> and take a quiz. The important part is that the application records every single user interaction
> as clickstream data, in the same format as Moodle logs.

**Do:** Show the terminal with `npm start` running, then switch to the browser.

---

## 0:30 – 1:00 — Login

**Say:**

> This is the login page. I have two hardcoded learner accounts, student1 and student2. There is no
> registration and no password hashing, because this is a beginner project focused on data collection,
> not on security.

**Do:**

- Type `student1` and `123`.
- Click **Login**.

**Say:**

> That login has already been written into the database as a "User logged in" event. I will show it
> at the end.

---

## 1:00 – 1:30 — Home and Course

**Do:**

- Point at the blue navbar: Home, Course, Progress, Logs, Logout.
- Click **Open Course**.

**Say:**

> There is one course, "Introduction to Learning Analytics", with two lessons and one quiz.
> Simply opening this page created a "Course viewed" event — exactly like Moodle does.

---

## 1:30 – 2:30 — Lesson 1

**Do:**

- Click **Open Lesson 1**.
- Scroll through the reading material.
- Press **play** on the 3Blue1Brown video, let it run 5 seconds, then **pause** it.

**Say:**

> Each lesson has reading material and a YouTube video. I use the YouTube player API so the app knows
> when the video is played, paused or finished. Those three actions have just been recorded as
> "Video played" and "Video paused" events.

**Do:** Click **Mark video as watched**.

**Say:**

> This button is just for the demo so I do not have to watch the whole video — it sends a
> "Video ended" event and counts the video on the progress page.

---

## 2:30 – 3:00 — Lesson 2

**Do:**

- Click **Next: Lesson 2**.
- Scroll the reading, click **Mark video as watched**.

**Say:**

> Lesson 2 explains what clickstream data actually is, with a StatQuest video. Opening this lesson
> created "Lesson opened" and "Reading opened" events.

---

## 3:00 – 3:45 — Quiz

**Do:**

- Click **Next: Take the Quiz**.
- Answer all 5 questions, changing your mind once on purpose.
- Click **Submit Quiz**.

**Say:**

> The quiz has five multiple choice questions. Every time I click an option, that click is stored,
> including the answer I changed my mind about — that is very useful data for a teacher. When I
> submit, the server marks the quiz, stores the attempt in the quiz_attempts table and shows my score.

---

## 3:45 – 4:15 — Progress Page

**Do:** Click **Progress** in the navbar.

**Say:**

> The progress page reads the database and shows lessons completed, videos watched, my best quiz
> score, number of attempts, and the total number of events I have generated so far.

---

## 4:15 – 5:00 — Logs Page (the main part)

**Do:** Click **Logs** in the navbar. Scroll slowly through the table.

**Say:**

> And this is the heart of the project — the clickstream log report. Newest events are at the top.
> For every event I store the time, the user, the event context, the component, the event name, a
> description, the origin, and the IP address. This is the same structure as the Moodle log export we
> were shown in class.
>
> Everything is stored in a SQLite table called clickstream. Every page and every button in the app
> calls one small helper function called logEvent, which inserts one row into this table.

**Do:** Click **Logout**.

**Say:**

> That logout was also recorded. Thank you for watching. The full source code and README are on my
> GitHub repository.

---

## Tips

- Speak slowly, and let the mouse rest for a second on whatever you are talking about.
- Zoom the browser to 110–125 % so the text is readable in the video.
- If you want a bigger log table for the demo, click around the app a few times before recording,
  but keep the clicks meaningful.
