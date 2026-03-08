/**
 * University Management — API contract and types
 *
 * Use these interfaces as the source of truth for request/response shapes.
 * Implement your Flask API to return data matching these types.
 */

/** Student record. */
export interface Student {
  student_id: string;
  name: string;
  email: string;
}

/** Course/section record. */
export interface Course {
  course_id: string;
  code: string;           // e.g. "CS101"
  name: string;
  capacity: number;
  schedule: string;       // e.g. "MWF 10:00-10:50" or structured days + time
  prerequisites: string[]; // list of course_id that must be completed
}

/** Enrollment record (student enrolled in course). */
export interface Enrollment {
  enrollment_id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;   // ISO 8601
  status: string;        // e.g. "enrolled", "dropped"
}

/** Single line on a transcript (completed or in-progress course). */
export interface TranscriptRecord {
  course_id: string;
  code: string;
  name: string;
  enrolled_at: string;
  status: string;
  grade?: string;        // optional, e.g. "A", "B+", "P", "F"
}

/** Response for GET /api/students/:studentId/schedule */
export interface ScheduleEntry {
  course_id: string;
  code: string;
  name: string;
  schedule: string;
}

/** Response for GET /api/courses/:courseId/roster */
export interface RosterEntry {
  student_id: string;
  name: string;
  email: string;
  enrolled_at: string;
}

/** Response for GET /api/courses/:courseId/availability */
export interface CourseAvailability {
  course_id: string;
  code: string;
  name: string;
  capacity: number;
  enrolled_count: number;
  available_slots: number;
}

/** Request body for POST /api/enrollments */
export interface EnrollRequest {
  student_id: string;
  course_id: string;
}
