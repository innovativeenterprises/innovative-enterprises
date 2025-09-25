
import { z } from 'zod';

export const ProctoringInputSchema = z.object({
  studentId: z.string().min(1, "Student ID is required."),
  examId: z.string().min(1, "Exam ID is required."),
  sessionTranscript: z.string().min(20, "Session log must have some content."),
});
export type ProctoringInput = z.infer<typeof ProctoringInputSchema>;

export const ViolationSchema = z.object({
    timestamp: z.string(),
    type: z.string(),
    severity: z.enum(['High', 'Medium', 'Low']),
    evidence: z.string(),
});

export const ProctoringOutputSchema = z.object({
    reportId: z.string(),
    overallRiskScore: z.number().int().min(0).max(100),
    summary: z.string(),
    potentialViolations: z.array(ViolationSchema),
});
export type ProctoringOutput = z.infer<typeof ProctoringOutputSchema>;
