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
    subjectId: z.string(),
    classroomId: z.string(),
    teacher: z.string(),
});

// A more specific schema for the schedule object to satisfy the AI model's requirement for non-empty object types.
const DailyScheduleSchema = z.object({
    "08:00 - 10:00": ScheduleEntrySchema.optional(),
    "10:00 - 12:00": ScheduleEntrySchema.optional(),
    "13:00 - 15:00": ScheduleEntrySchema.optional(),
    "15:00 - 17:00": ScheduleEntrySchema.optional(),
    "08:00 - 09:00": ScheduleEntrySchema.optional(),
    "09:00 - 10:00": ScheduleEntrySchema.optional(),
    "10:00 - 11:00": ScheduleEntrySchema.optional(),
    "11:00 - 12:00": ScheduleEntrySchema.optional(),
    "12:00 - 13:00": ScheduleEntrySchema.optional(),
    "13:00 - 14:00": ScheduleEntrySchema.optional(),
}).describe("An object where keys are time slots and values are schedule entries.");


export const TimetableGeneratorOutputSchema = z.object({
  schedule: z.object({
      Sunday: DailyScheduleSchema.optional(),
      Monday: DailyScheduleSchema.optional(),
      Tuesday: DailyScheduleSchema.optional(),
      Wednesday: DailyScheduleSchema.optional(),
      Thursday: DailyScheduleSchema.optional(),
      Friday: DailyScheduleSchema.optional(),
      Saturday: DailyScheduleSchema.optional(),
  }).describe("The generated schedule, with days as keys."),
  diagnostics: z.object({
    isPossible: z.boolean(),
    message: z.string(),
    unassignedSubjects: z.array(z.string()).optional(),
  }),
});
export type TimetableGeneratorOutput = z.infer<typeof TimetableGeneratorOutputSchema>;
