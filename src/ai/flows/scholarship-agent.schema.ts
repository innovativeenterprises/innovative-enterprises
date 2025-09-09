
/**
 * @fileOverview Schemas and types for the Scholarship AI Agent flow.
 */
import { z } from 'zod';

export const ScholarshipFinderInputSchema = z.object({
  fieldOfStudy: z.string().describe('The student\'s desired field of study (e.g., Engineering, Medicine, Computer Science).'),
  studyLevel: z.enum(['Bachelors', 'Masters', 'PhD'], {
    required_error: "Please select a study level."
  }).describe("The level of study for the scholarship."),
  country: z.string().optional().describe('An optional specific country to search for scholarships in.'),
});
export type ScholarshipFinderInput = z.infer<typeof ScholarshipFinderInputSchema>;


const ScholarshipSchema = z.object({
    scholarshipName: z.string().describe("The official name of the scholarship."),
    institution: z.string().describe("The name of the university or organization providing the scholarship."),
    country: z.string().describe("The country where the institution is located."),
    fieldOfStudy: z.string().describe("The eligible field(s) of study."),
    deadline: z.string().optional().describe("The application deadline (e.g., 'October 31, 2024')."),
    eligibilitySummary: z.string().describe("A brief summary of the key eligibility requirements."),
    sourceUrl: z.string().url().optional().describe("The direct URL to the scholarship announcement or application page."),
});

export const ScholarshipFinderOutputSchema = z.object({
  summary: z.string().describe("A brief summary of the findings."),
  scholarships: z.array(ScholarshipSchema).describe("A list of found scholarship opportunities."),
});
export type ScholarshipFinderOutput = z.infer<typeof ScholarshipFinderOutputSchema>;

    
