
/**
 * @fileOverview Schemas for the Project Inception AI flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the project inception AI flow.
 */

import { z } from 'zod';

export const ProjectInceptionInputSchema = z.object({
  idea: z.string().describe('A clear, concise description of the new product or project idea.'),
});
export type ProjectInceptionInput = z.infer<typeof ProjectInceptionInputSchema>;


const CoreFeatureSchema = z.object({
    title: z.string().describe("A short, descriptive title for the feature."),
    description: z.string().describe("A one-sentence explanation of what the feature does and why it's valuable."),
    acceptanceCriteria: z.string().describe("A brief, bullet-point-ready list of conditions that must be met for the feature to be considered complete."),
});

const RiskSchema = z.object({
    risk: z.string().describe("A concise description of a potential risk."),
    mitigation: z.string().describe("A brief plan to mitigate this risk."),
    likelihood: z.enum(['High', 'Medium', 'Low']).describe("The likelihood of this risk occurring."),
});


export const ProjectInceptionOutputSchema = z.object({
  projectName: z.string().describe('A catchy and descriptive name for the project.'),
  summary: z.string().describe('A one-paragraph elevator pitch for the project.'),
  problemStatement: z.string().describe('A clear statement of the problem this project solves for its users.'),
  valueProposition: z.string().describe('The unique value and benefit this project offers.'),
  targetAudience: z.string().describe('A description of the primary target audience for this project.'),
  coreFeatures: z.array(CoreFeatureSchema).describe('A list of 3-5 essential features for the Minimum Viable Product (MVP), structured as objects.'),
  risks: z.array(RiskSchema).describe('A list of 3 potential risks (market, technical, execution), structured as objects.'),
  recommendedAgents: z.array(z.string()).describe('A list of recommended AI agents from the provided list that should be assigned to this project.'),
  imagePrompt: z.string().describe('A simple, two-word prompt for an AI image generator to create a visually appealing image for this project (e.g., "virtual reality", "community safety").'),
});
export type ProjectInceptionOutput = z.infer<typeof ProjectInceptionOutputSchema>;
