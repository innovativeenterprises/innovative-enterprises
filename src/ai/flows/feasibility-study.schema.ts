/**
 * @fileOverview Schemas for the Feasibility Study Generator AI flow.
 */
import { z } from 'zod';

export const FeasibilityStudyInputSchema = z.object({
  businessIdea: z.string().describe('A detailed description of the business idea to be analyzed.'),
});
export type FeasibilityStudyInput = z.infer<typeof FeasibilityStudyInputSchema>;

export const FeasibilityStudyOutputSchema = z.object({
  title: z.string().describe('A clear and descriptive title for the feasibility study.'),
  executiveSummary: z.string().describe('A one-paragraph high-level summary of the entire feasibility study.'),
  marketAnalysis: z.object({
    summary: z.string().describe('A summary of the market analysis, including size, trends, and growth potential.'),
    keyPoints: z.array(z.string()).describe('A list of key findings from the market analysis.'),
  }),
  competitiveLandscape: z.object({
    summary: z.string().describe('A summary of the competitive landscape, identifying key players and their positioning.'),
    competitors: z.array(z.object({
      name: z.string().describe('The name of the competitor.'),
      strengths: z.string().describe('A brief description of the competitor\'s key strengths.'),
      weaknesses: z.string().describe('A brief description of the competitor\'s key weaknesses.'),
    })).describe('A list of major competitors.'),
  }),
  targetAudience: z.object({
    summary: z.string().describe('A summary describing the ideal customer profile, including demographics and psychographics.'),
    keyCharacteristics: z.array(z.string()).describe('A list of key characteristics of the target audience.'),
  }),
  recommendation: z.object({
    conclusion: z.string().describe('A final conclusion on the viability of the business idea based on the analysis.'),
    confidenceScore: z.number().min(0).max(100).describe('A score from 0 to 100 representing the confidence in the idea\'s success.'),
  }),
});
export type FeasibilityStudyOutput = z.infer<typeof FeasibilityStudyOutputSchema>;
