/**
 * @fileOverview Schemas for the AI Timetable/Schedule Generator flow.
 */
import { z } from 'zod';

const SubjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Task name cannot be empty."),
  teacher: z.string().min(1, "Worker/Team name cannot be empty."),
  requiredSlots: z.coerce.number().min(1, "Required slots must be at least 1."),
});
export type Subject = z.infer<typeof SubjectSchema>;

const ClassroomSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Site name cannot be empty."),
});
export type Classroom = z.infer<typeof ClassroomSchema>;


export const TimetableGeneratorInputSchema = z.object({
  subjects: z.array(SubjectSchema).min(1, "At least one task is required."),
  classrooms: z.array(ClassroomSchema).min(1, "At least one job site is required."),
  timeSlots: z.array(z.string()).min(1, "At least one time slot is required."),
  days: z.array(z.string()).min(1, "At least one day is required."),
});
export type TimetableGeneratorInput = z.infer<typeof TimetableGeneratorInputSchema>;

const ScheduleEntrySchema = z.object({
    day: z.string().describe("The day of the week for this entry (e.g., 'Sunday')."),
    timeSlot: z.string().describe("The time slot for this entry (e.g., '08:00 - 10:00')."),
    subjectId: z.string(),
    classroomId: z.string(),
    teacher: z.string(),
});
export type ScheduleEntry = z.infer<typeof ScheduleEntrySchema>

export const TimetableGeneratorOutputSchema = z.object({
  schedule: z.array(ScheduleEntrySchema).describe("A flat list of all scheduled appointments."),
  diagnostics: z.object({
    isPossible: z.boolean(),
    message: z.string(),
    unassignedSubjects: z.array(z.string()).optional(),
  }),
});
export type TimetableGeneratorOutput = z.infer<typeof TimetableGeneratorOutputSchema>;
