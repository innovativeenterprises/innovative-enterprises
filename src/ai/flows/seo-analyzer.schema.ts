/**
 * @fileOverview Schemas for the SEO Analyzer AI flow.
 */
import { z } from 'zod';

export const SeoAnalysisInputSchema = z.object({
  url: z.string().url("Please enter a valid URL to analyze."),
  keyword: z.string().min(2, "Please enter a keyword to analyze."),
});
export type SeoAnalysisInput = z.infer<typeof SeoAnalysisInputSchema>;

const RecommendationSchema = z.object({
    isCompliant: z.boolean().describe("Whether this aspect is SEO-compliant."),
    recommendation: z.string().describe("A specific, actionable recommendation for improvement."),
});

export const SeoAnalysisOutputSchema = z.object({
  seoScore: z.number().min(0).max(100).describe("An overall SEO score from 0 to 100."),
  summary: z.string().describe("A brief summary of the page's SEO health and key areas for improvement."),
  titleAnalysis: RecommendationSchema,
  metaDescriptionAnalysis: RecommendationSchema,
  headingsAnalysis: RecommendationSchema,
  contentAnalysis: z.object({
    keywordDensity: z.string().describe("The calculated keyword density (e.g., '1.5%')."),
    recommendation: z.string().describe("Recommendations for improving content and keyword usage."),
  }),
});
export type SeoAnalysisOutput = z.infer<typeof SeoAnalysisOutputSchema>;
