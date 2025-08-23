'use server';

/**
 * @fileOverview An AI agent that generates social media posts.
 *
 * This file contains the server-side logic for the social media post generation flow.
 * It is intended to be used as a Next.js Server Action.
 *
 * - generateSocialMediaPost - A function that generates a social media post.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateSocialMediaPostInput,
    GenerateSocialMediaPostInputSchema,
    GenerateSocialMediaPostOutput,
    GenerateSocialMediaPostOutputSchema
} from './social-media-post-generator.schema';

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
Also, provide a list of relevant hashtags to maximize reach. For WhatsApp, hashtags are not needed.
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
