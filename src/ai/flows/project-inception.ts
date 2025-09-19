

'use server';

/**
 * @fileOverview An AI agent that takes a project idea and generates a comprehensive initial analysis.
 * - generateProjectPlan - A function that creates the initial project plan.
 */

import { ai } from '@/ai/genkit';
import { getStaffData } from '@/lib/firestore';
import {
    ProjectInceptionInput,
    ProjectInceptionInputSchema,
    ProjectInceptionOutput,
    ProjectInceptionOutputSchema,
} from './project-inception.schema';
import { z } from 'zod';

export async function generateProjectPlan(input: ProjectInceptionInput): Promise<ProjectInceptionOutput> {
  return projectInceptionFlow(input);
}


const prompt = ai.definePrompt({
  name: 'projectInceptionPrompt',
  input: { schema: ProjectInceptionInputSchema.extend({ allAgents: z.array(z.string()) }) },
  output: { schema: ProjectInceptionOutputSchema },
  prompt: `You are "Navi," an expert AI Product Manager and Innovation Agent.
Your task is to take a raw product idea and transform it into a structured, initial project plan.
The output of this plan should be highly structured, using objects for features and risks, making it ready for integration into project management tools like Trello or Notion.

**Product Idea:**
{{{idea}}}

**Your Instructions:**

1.  **Analyze the Idea:** Thoroughly analyze the user's idea to understand its core purpose and potential.
2.  **Generate a Project Plan:** Create a comprehensive analysis covering the following sections:
    *   **Project Name:** Propose a catchy, descriptive name for the project.
    *   **Summary:** Write a compelling one-paragraph elevator pitch.
    *   **Problem Statement:** Clearly define the specific problem this project will solve.
    *   **Value Proposition:** What is the unique benefit this project delivers to its users?
    *   **Target Audience:** Describe the ideal user or customer for this product.
    *   **Core Features (MVP):** Identify the 3-5 most essential features for the first version (Minimum Viable Product). For each feature, provide a structured object with a 'title', 'description', and 'acceptanceCriteria'. The acceptance criteria should be a concise statement of what is needed to consider the feature done.
    *   **Risks:** Identify 3 potential risks (e.g., market competition, technical challenges, user adoption). For each risk, provide a structured object with the 'risk' itself, a 'mitigation' plan, and its 'likelihood' ('High', 'Medium', 'Low').
    *   **Recommended Agents:** From the list of available AI agents below, select the most relevant agents that should be assigned to this project to ensure its success.
    *   **Image Prompt:** Based on the project idea, create a simple, two-word prompt suitable for an AI image generator. The prompt should capture the essence of the project visually (e.g., "virtual reality", "community safety", "data analytics").

**Available AI Agents:**
{{#each allAgents}}
- {{this}}
{{/each}}

Return the complete analysis in the specified structured JSON format.
`,
});

const projectInceptionFlow = ai.defineFlow(
  {
    name: 'projectInceptionFlow',
    inputSchema: ProjectInceptionInputSchema,
    outputSchema: ProjectInceptionOutputSchema,
  },
  async (input) => {
    // Fetch all staff and agent data dynamically
    const { leadership, staff, agentCategories } = await getStaffData();
    const allWorkforce = [...leadership, ...staff, ...agentCategories.flatMap(c => c.agents)];
    const allAgentNames = allWorkforce.map(agent => `'${agent.name}' ('${agent.role}')`);

    const { output } = await prompt({
        ...input,
        allAgents: allAgentNames,
    });
    return output!;
  }
);
