
import { z } from 'zod';

export const FeasibilityStudyInputSchema = z.object({
  businessIdea: z.string().describe("A concise description of the business idea to be analyzed."),
});
export type FeasibilityStudyInput = z.infer<typeof FeasibilityStudyInputSchema>;

const CompetitorSchema = z.object({
    name: z.string(),
    strengths: z.string(),
    weaknesses: z.string(),
});

const AnalysisSectionSchema = z.object({
    summary: z.string(),
    keyPoints: z.array(z.string()),
});

export const FeasibilityStudyOutputSchema = z.object({
  title: z.string().describe("The generated title of the feasibility study."),
  executiveSummary: z.string().describe("A high-level summary of the entire study."),
  marketAnalysis: AnalysisSectionSchema.describe("An analysis of the target market."),
  competitiveLandscape: z.object({
      summary: z.string(),
      competitors: z.array(CompetitorSchema),
  }).describe("An analysis of the competitive landscape."),
  targetAudience: z.object({
      summary: z.string(),
      keyCharacteristics: z.array(z.string()),
  }).describe("A profile of the ideal target audience."),
  recommendation: z.object({
      conclusion: z.string(),
      confidenceScore: z.number().int().min(0).max(100),
  }).describe("The final recommendation and confidence score."),
});
export type FeasibilityStudyOutput = z.infer<typeof FeasibilityStudyOutputSchema>;
