# Challenge 4: University Management

## 1. Overview

Build a Flask API for university course management. Data is in `mock-data/students.json`, `courses.json`, and `enrollments.json`. The API exposes student schedule and transcript, course roster and availability, and a POST endpoint to create enrollments. You must enforce business rules: no duplicate enrollment, course capacity, prerequisites, and schedule conflict detection.

## 2. Problem Statement

You are building an API that allows students to view their schedule and transcript, instructors to view course roster and availability, and the system to process enrollment requests. When enrolling, the API must reject requests that would violate: (1) already enrolled in the course, (2) course at capacity, (3) prerequisites not satisfied, (4) schedule conflict with an existing enrollment.

## 3. Requirements

- Read from `mock-data/students.json`, `mock-data/courses.json`, and `mock-data/enrollments.json`.
- Implement the five required endpoints (see below), including POST /api/enrollments.
- **Schedule:** Return current term enrollments with status "enrolled" only; include course code, name, schedule.
- **Transcript:** Return all enrollments for the student (or only enrolled/completed—document your choice); include course and enrollment info.
- **Roster:** Return all students enrolled in the course (status "enrolled"); include student details and enrolled_at.
- **Availability:** Return capacity, enrolled_count (count of enrollments with status "enrolled"), and available_slots = capacity - enrolled_count.
- **POST /api/enrollments:** Body: `{ "student_id": "...", "course_id": "..." }`. Create enrollment only if: student and course exist; student is not already enrolled; course has available slots; student has completed all prerequisites (prerequisites are course_ids; "completed" means the student has an enrollment with status "enrolled" or "completed" for that course); no schedule conflict with any current enrollment. Return 201 with enrollment object on success; 400 for invalid IDs or missing body; 409 for business rule violation with a clear error message.
- **Schedule conflict:** Two courses conflict if their meeting times overlap. Parse the `schedule` string (e.g. "MWF 10:00-10:50" = Mon/Wed/Fri 10:00–10:50) and detect overlapping day+time. You may assume a single timezone and a simple format for the take-home; document the format you support.

## 4. Expected Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/students/:studentId/schedule` | Current schedule (enrolled courses with code, name, schedule). |
| GET | `/api/students/:studentId/transcript` | Transcript (enrollment records with course info). |
| GET | `/api/courses/:courseId/roster` | List of enrolled students with details. |
| GET | `/api/courses/:courseId/availability` | Capacity, enrolled count, available slots. |
| POST | `/api/enrollments` | Create enrollment; enforce business rules. |

## 5. Data Models

See `task.ts` for the canonical types:

- **Student:** student_id, name, email
- **Course:** course_id, code, name, capacity, schedule, prerequisites (array of course_id)
- **Enrollment:** enrollment_id, student_id, course_id, enrolled_at, status
- **TranscriptRecord:** course_id, code, name, enrolled_at, status, optional grade
- **ScheduleEntry:** course_id, code, name, schedule
- **RosterEntry:** student_id, name, email, enrolled_at
- **CourseAvailability:** course_id, code, name, capacity, enrolled_count, available_slots
- **EnrollRequest:** student_id, course_id

## 6. Expected Behavior

- **Schedule:** Only courses where the student has an active enrollment (e.g. status "enrolled"); order by course code or schedule.
- **Transcript:** All enrollments for the student with course details; optional grade if you have it.
- **Roster:** Only active enrollments; include student name and email from students.json.
- **Availability:** enrolled_count = number of enrollments with status "enrolled" for that course; available_slots = capacity - enrolled_count.
- **POST enrollments:** Validate student_id and course_id exist. Then check: not already enrolled, capacity, prerequisites (all prerequisite course_ids must appear in the student’s transcript as completed/enrolled), no schedule overlap with current enrollments. If any check fails, return 409 with a descriptive error.

## 7. Suggested Project Structure and Local Commands

```
university-management/
  app.py
  requirements.txt
  mock-data/          # (provided)
  services/
    enrollment_service.py   # enrollment logic, conflict detection
    course_service.py
  routes/
    student_routes.py
    course_routes.py
    enrollment_routes.py
  tests/
    test_enrollment_rules.py
  frontend/           # React app that calls your Flask API
    package.json
    src/
      ...
```

After you implement this challenge, it should be possible to:

- **Run the backend locally** from `university-management/` (example):
  - `python -m venv .venv && source .venv/bin/activate`
  - `pip install -r requirements.txt`
  - `flask run` (or an equivalent command you document here)
- **Run the frontend locally** from `university-management/frontend/`:
  - `npm install`
  - `npm run dev`
- **Build the frontend** from `university-management/frontend/`:
  - `npm run build`

Document the exact commands you support in this README once your implementation is in place.

## 8. Evaluation Criteria

- Correctness of roster, availability, schedule, and transcript.
- POST enrollment: all four business rules enforced and correct HTTP status and error messages.
- Schedule conflict detection works for the given schedule format.
- Handling of invalid student_id or course_id (404 or 400).
- Code organization and tests (especially for enrollment rules).

## 9. Example Response

See `example-response.json` for sample GET responses and example POST success and failure cases (course full, already enrolled).

---

## 10. Follow-Up Interview Questions

*For the interviewer: use after the base implementation is complete. Not part of the required task. Ordered from easier to harder; probe backend judgment, API design, data modeling, reliability, and scale.*

1. How would you add waitlist support when a course is full?
2. How would you model multiple terms and historical sections (e.g. CS101 Fall 2023 vs Spring 2024)?
3. How would you handle concurrent enrollment requests (two students for the last seat)?
4. How would you design the database schema (tables, indexes) for students, courses, enrollments?
5. How would you expose drop/enrollment changes with audit history?
6. How would you support prerequisite chains (e.g. CS101 -> CS102 -> CS201) and equivalent courses?
7. How would you scale enrollment checks if many users enroll at once (e.g. registration opening)?
8. How would you model course sections (same course, different times) and avoid double-counting capacity?
9. How would you add role-based access (student vs advisor vs admin)?
10. How would you handle schedule format variations (different campuses, different time formats)?
11. How would you design an idempotent enrollment API for retries?
12. How would you support bulk enrollment (e.g. import from CSV) with validation and rollback?

---

## 11. Edge Cases to Discuss After Implementation

*For the interviewer: discussion only. Not required in the base implementation. Ordered from easier to harder.*

1. **Enrolling in a full course:** How do you return a clear error and avoid race conditions?
2. **Duplicate enrollment request:** Same student + course submitted twice. How do you make it idempotent?
3. **Prerequisite satisfied by equivalent course:** Course A accepts "CS101 or CS101X". How do you model equivalents?
4. **Overlapping class times on only some days:** Course 1 is MWF 10-11, Course 2 is WF 10-11. They overlap on W and F. How do you detect?
5. **Invalid student or course IDs:** How do you return 404 vs 400 and consistent error shape?
6. **Transcript with pass/fail courses:** How do you treat "P" for prerequisite satisfaction?
7. **Inconsistent enrolled_count vs actual roster:** Data corruption or sync issue. How do you detect and repair?
8. **Cross-listed courses:** Same section listed as CS101 and ECE101. How do you avoid double enrollment or double capacity?
9. **Dropped course:** Student drops a prerequisite after another course that required it. How do you handle?
10. **Course capacity changed after enrollments:** Capacity reduced below current enrolled_count. How do you handle?
11. **Enrollment in the past:** enrolled_at in the future or very old. How do you validate?
12. **Malformed schedule string:** Parser fails. How do you fail safely for conflict detection?
