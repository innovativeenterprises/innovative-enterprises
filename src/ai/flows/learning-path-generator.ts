
'use server';

/**
 * @fileOverview An AI agent that generates personalized learning paths.
 */

import { ai } from '@/ai/genkit';
import {
    LearningPathInputSchema,
    LearningPathInput,
    LearningPathOutputSchema,
    LearningPathOutput,
} from './learning-path-generator.schema';


export async function generateLearningPath(input: LearningPathInput): Promise<LearningPathOutput> {
  return learningPathGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'learningPathGeneratorPrompt',
  input: { schema: LearningPathInputSchema },
  output: { schema: LearningPathOutputSchema },
  prompt: `You are an expert curriculum designer and academic advisor AI. Your task is to create a comprehensive, structured learning path for a student based on their goals.

**Student's Request:**
- **Learning Goal:** {{{learningGoal}}}
- **Target Audience Level:** {{{targetAudience}}}
{{#if currentKnowledge}}
- **Current Knowledge:** {{{currentKnowledge}}}
{{/if}}

**Instructions:**
1.  **Deconstruct the Goal:** Break down the main learning goal into logical, sequential modules. A good learning path typically has 3-5 high-level modules.
2.  **Structure Modules:** For each module:
    *   Create a clear, descriptive title.
    *   Write a brief summary of the module's content.
    *   Break the module down into smaller, manageable topics or lessons.
    *   For each topic, provide a one-sentence description and estimate the hours required to learn it. The hours should be reasonable for the specified audience level.
3.  **Generate Path Overview:**
    *   Create an overall title for the learning path.
    *   Write a one-paragraph description of the entire path, explaining what the student will achieve by the end.
    *   Calculate and provide the total estimated hours for the entire learning path by summing up the hours for all topics.
4.  **Return Structured Data:** Provide the complete learning path in the specified JSON format. Ensure all modules, topics, and estimations are included.
`,
});

const learningPathGeneratorFlow = ai.defineFlow(
  {
    name: 'learningPathGeneratorFlow',
    inputSchema: LearningPathInputSchema,
    outputSchema: LearningPathOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: prompt,
      input: input,
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'json',
        schema: LearningPathOutputSchema,
      }
    });

    return llmResponse.output()!;
  }
);
  
