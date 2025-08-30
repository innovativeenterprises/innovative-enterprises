/**
 * @fileOverview Schemas and types for the Admissions Agent AI flow.
 */
import { z } from 'zod';

const AcademicRecordSchema = z.object({
  schoolName: z.string().describe("Name of the previous school/university."),
  qualification: z.string().describe("e.g., High School Diploma, Bachelor's Degree."),
  grade: z.string().describe("e.g., 95%, 3.8 GPA."),
});

export const AdmissionsAgentInputSchema = z.object({
  fullName: z.string().describe("The applicant's full name."),
  dateOfBirth: z.string().describe("The applicant's date of birth."),
  nationality: z.string().describe("The applicant's nationality."),
  programOfInterest: z.string().describe("The academic program the applicant is interested in."),
  academicHistory: z.array(AcademicRecordSchema).describe("A list of the applicant's academic records."),
  personalStatement: z.string().describe("The applicant's personal statement or essay."),
  transcriptUri: z.string().optional().describe("An optional transcript document, as a data URI."),
});
export type AdmissionsAgentInput = z.infer<typeof AdmissionsAgentInputSchema>;

export const AdmissionsAgentOutputSchema = z.object({
  applicationId: z.string().describe("A unique ID for this application."),
  summary: z.string().describe("A concise summary of the applicant's profile and strengths."),
  readinessScore: z.number().min(0).max(100).describe("An AI-generated score indicating the applicant's readiness and fit for the program."),
  keyStrengths: z.array(z.string()).describe("A list of key strengths identified from the application."),
  areasForReview: z.array(z.string()).describe("A list of potential concerns or areas needing manual review."),
  recommendedNextStep: z.enum(['Interview', 'Conditional Offer', 'Further Review', 'Reject']).describe("The recommended next action for the admissions team."),
});
export type AdmissionsAgentOutput = z.infer<typeof AdmissionsAgentOutputSchema>;
