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


export const ProjectInceptionOutputSchema = z.object({
  projectName: z.string().describe('A catchy and descriptive name for the project.'),
  summary: z.string().describe('A one-paragraph elevator pitch for the project.'),
  problemStatement: z.string().describe('A clear statement of the problem this project solves for its users.'),
  valueProposition: z.string().describe('The unique value and benefit this project offers.'),
  targetAudience: z.string().describe('A description of the primary target audience for this project.'),
  coreFeatures: z.array(z.string()).describe('A bulleted list of 3-5 essential features for the Minimum Viable Product (MVP).'),
  risks: z.array(z.string()).describe('A bulleted list of 3 potential risks (market, technical, execution).'),
  recommendedAgents: z.array(z.string()).describe('A list of recommended AI agents from the provided list that should be assigned to this project.'),
});
export type ProjectInceptionOutput = z.infer<typeof ProjectInceptionOutputSchema>;
