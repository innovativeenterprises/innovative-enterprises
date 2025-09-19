
import { z } from 'zod';

const AcademicHistorySchema = z.object({
  schoolName: z.string(),
  qualification: z.string(),
  grade: z.string(),
});

export const AdmissionsAgentInputSchema = z.object({
  fullName: z.string(),
  dateOfBirth: z.string(),
  nationality: z.string(),
  programOfInterest: z.string(),
  academicHistory: z.array(AcademicHistorySchema),
  personalStatement: z.string(),
  transcriptUri: z.string().optional(),
});
export type AdmissionsAgentInput = z.infer<typeof AdmissionsAgentInputSchema>;

export const AdmissionsAgentOutputSchema = z.object({
  applicationId: z.string().describe('A unique identifier for the application.'),
  readinessScore: z.number().int().min(0).max(100).describe('An overall readiness score from 0-100.'),
  summary: z.string().describe('A concise one-paragraph summary of the applicant and their suitability.'),
  keyStrengths: z.array(z.string()).describe('A list of key strengths.'),
  areasForReview: z.array(z.string()).describe('A list of areas that require further review.'),
  recommendedNextStep: z.enum(['Interview', 'Conditional Offer', 'Further Review', 'Reject']),
});
export type AdmissionsAgentOutput = z.infer<typeof AdmissionsAgentOutputSchema>;
