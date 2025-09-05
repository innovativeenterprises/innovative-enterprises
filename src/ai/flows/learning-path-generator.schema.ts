
/**
 * @fileOverview Schemas for the AI Learning Path Generator flow.
 */
import { z } from 'zod';

const ModuleTopicSchema = z.object({
  title: z.string().describe("The title of the sub-topic or lesson."),
  description: z.string().describe("A brief, one-sentence description of the topic."),
  estimatedHours: z.coerce.number().describe("An estimated number of hours to master this topic."),
});

const ModuleSchema = z.object({
  title: z.string().describe("The title of the module (e.g., 'Introduction to Calculus', 'Advanced Integration Techniques')."),
  description: z.string().describe("A brief summary of what will be covered in this module."),
  topics: z.array(ModuleTopicSchema).describe("A list of specific topics or lessons within this module."),
});

export const LearningPathInputSchema = z.object({
  learningGoal: z.string().min(5, "Please provide a more detailed learning goal."),
  currentKnowledge: z.string().optional().describe("A brief description of the user's current knowledge level."),
  targetAudience: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Beginner'),
});
export type LearningPathInput = z.infer<typeof LearningPathInputSchema>;

export const LearningPathOutputSchema = z.object({
  pathTitle: z.string().describe("A suitable title for the generated learning path."),
  pathDescription: z.string().describe("A one-paragraph overview of the entire learning path."),
  totalEstimatedHours: z.number().describe("The total estimated hours for the entire learning path."),
  modules: z.array(ModuleSchema).describe("A list of structured modules for the learning path."),
});
export type LearningPathOutput = z.infer<typeof LearningPathOutputSchema>;
