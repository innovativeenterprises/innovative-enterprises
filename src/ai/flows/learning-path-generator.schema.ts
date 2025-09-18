
import { z } from 'zod';

export const LearningPathInputSchema = z.object({
  learningGoal: z.string(),
  currentKnowledge: z.string().optional(),
  targetAudience: z.string(),
});
export type LearningPathInput = z.infer<typeof LearningPathInputSchema>;


export const LearningPathOutputSchema = z.object({
  title: z.string(),
  description: z.string(),
  totalEstimatedHours: z.number(),
  modules: z.array(z.object({
    title: z.string(),
    summary: z.string(),
    topics: z.array(z.object({
        name: z.string(),
        description: z.string(),
        estimatedHours: z.number(),
    })),
  })),
});
export type LearningPathOutput = z.infer<typeof LearningPathOutputSchema>;
