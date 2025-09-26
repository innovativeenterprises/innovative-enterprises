
import { z } from 'zod';

/**
 * @fileOverview Schemas for CV analysis and generation flows.
 */

// Schema for the input of the CV analysis flow
export const CvAnalysisInputSchema = z.object({
  cvDataUri: z.string().url().describe("The data URI of the CV document to analyze."),
});
export type CvAnalysisInput = z.infer<typeof CvAnalysisInputSchema>;

// Schema for the output of the CV analysis flow
export const CvAnalysisOutputSchema = z.object({
  overallScore: z.number().int().min(0).max(100).describe('An overall ATS optimization score from 0-100.'),
  summary: z.string().describe('A brief summary of the key areas for improvement.'),
  contactInfo: z.object({
    isCompliant: z.boolean(),
    suggestions: z.array(z.string()),
  }),
  workExperience: z.object({
    isCompliant: z.boolean(),
    suggestions: z.array(z.string()),
  }),
  skills: z.object({
    isCompliant: z.boolean(),
    suggestions: z.array(z.string()),
  }),
  education: z.object({
    isCompliant: z.boolean(),
    suggestions: z.array(z.string()),
  }),
  formatting: z.object({
    isCompliant: z.boolean(),
    suggestions: z.array(z.string()),
  }),
});
export type CvAnalysisOutput = z.infer<typeof CvAnalysisOutputSchema>;


// Schema for the input of the CV generation flow
export const CvGenerationInputSchema = z.object({
  cvDataUri: z.string().url().describe("The data URI of the original CV document."),
  targetPosition: z.string().describe("The job title the user is applying for."),
  jobAdvertisement: z.string().optional().describe("The full text of the job advertisement."),
  languages: z.array(z.string()).min(1).describe("An array of languages to generate the documents in."),
});
export type CvGenerationInput = z.infer<typeof CvGenerationInputSchema>;

// Schema for the output of the CV generation flow
export const CvGenerationOutputSchema = z.object({
  newCvContent: z.string().describe("The full content of the newly generated, enhanced CV in Markdown format."),
  newCoverLetterContent: z.string().describe("The full content of the tailored cover letter in Markdown format."),
  newOverallScore: z.number().int().min(0).max(100).describe('The new estimated ATS score for the enhanced CV.'),
});
export type CvGenerationOutput = z.infer<typeof CvGenerationOutputSchema>;
