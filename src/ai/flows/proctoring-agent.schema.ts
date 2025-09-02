/**
 * @fileOverview Schemas and types for the AI Proctoring Agent flow.
 */
import { z } from 'zod';

export const ProctoringInputSchema = z.object({
  studentId: z.string().describe("The ID of the student taking the exam."),
  examId: z.string().describe("The ID of the exam session."),
  sessionTranscript: z.string().describe("A transcript of events and sounds detected during the exam session. This is a log, not a voice-to-text transcript."),
});
export type ProctoringInput = z.infer<typeof ProctoringInputSchema>;

const ViolationSchema = z.object({
    timestamp: z.string().describe("The timestamp of the potential violation (e.g., 00:15:32)."),
    violationType: z.enum(['Unidentified Voice Detected', 'Student Left View', 'Mobile Phone Detected', 'Multiple Faces Detected', 'Copy/Paste Activity']),
    severity: z.enum(['Low', 'Medium', 'High']).describe("The assessed severity of the violation."),
    evidence: z.string().describe("A brief description of the evidence for the violation."),
});

export const ProctoringOutputSchema = z.object({
  reportId: z.string().describe("A unique ID for this proctoring report."),
  overallRiskScore: z.number().min(0).max(100).describe("An overall risk score for the session, from 0 (no risk) to 100 (high risk)."),
  summary: z.string().describe("A concise summary of the session's integrity."),
  potentialViolations: z.array(ViolationSchema).describe("A list of all potential violations detected during the session."),
});
export type ProctoringOutput = z.infer<typeof ProctoringOutputSchema>;
