'use server';

/**
 * @fileOverview An AI agent that generates social media posts.
 *
 * - generateSocialMediaPost - A function that generates a social media post.
 * - GenerateSocialMediaPostInput - The input type for the generateSocialMediaPost function.
 * - GenerateSocialMediaPostOutput - The return type for the generateSocialMediaPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateSocialMediaPostInputSchema = z.object({
  topic: z.string().describe('The topic for the social media post.'),
  platform: z.enum(['Twitter', 'LinkedIn', 'Facebook']).describe('The target social media platform.'),
  tone: z.enum(['Professional', 'Casual', 'Witty', 'Enthusiastic']).describe('The desired tone of the post.'),
});
export type GenerateSocialMediaPostInput = z.infer<typeof GenerateSocialMediaPostInputSchema>;

export const GenerateSocialMediaPostOutputSchema = z.object({
  postContent: z.string().describe('The generated social media post content.'),
  suggestedHashtags: z.array(z.string()).describe('A list of suggested hashtags.'),
});
export type GenerateSocialMediaPostOutput = z.infer<typeof GenerateSocialMediaPostOutputSchema>;

export async function generateSocialMediaPost(input: GenerateSocialMediaPostInput): Promise<GenerateSocialMediaPostOutput> {
  return socialMediaPostGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'socialMediaPostGeneratorPrompt',
  input: {schema: GenerateSocialMediaPostInputSchema},
  output: {schema: GenerateSocialMediaPostOutputSchema},
  prompt: `You are an expert social media manager. Your task is to generate a compelling social media post.

Platform: {{{platform}}}
Topic: {{{topic}}}
Tone: {{{tone}}}

Based on the above, create a post content that is engaging and appropriate for the specified platform and tone.
Also, provide a list of relevant hashtags to maximize reach.
`,
});

const socialMediaPostGeneratorFlow = ai.defineFlow(
  {
    name: 'socialMediaPostGeneratorFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
