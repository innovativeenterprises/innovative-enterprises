
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
import { generateImage } from './image-generator';

export async function generateSocialMediaPost(input: GenerateSocialMediaPostInput): Promise<GenerateSocialMediaPostOutput> {
  return socialMediaPostGeneratorFlow(input);
}

const textGenerationPrompt = ai.definePrompt({
  name: 'socialMediaTextGeneratorPrompt',
  input: {schema: GenerateSocialMediaPostInputSchema},
  output: {schema: GenerateSocialMediaPostOutputSchema.pick({ postContent: true, suggestedHashtags: true })},
  prompt: `You are an expert social media manager. Your task is to generate compelling social media post content.

Platform: {{{platform}}}
Topic: {{{topic}}}
Tone: {{{tone}}}

Based on the above, create post content that is engaging and appropriate for the specified platform and tone.
Also, provide a list of relevant hashtags to maximize reach. For WhatsApp, hashtags are not needed.
`,
});

const socialMediaPostGeneratorFlow = ai.defineFlow(
  {
    name: 'socialMediaPostGeneratorFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async (input) => {
    const textPromise = textGenerationPrompt(input);
    let imagePromise: Promise<string | undefined> | undefined;

    if (input.generateImage) {
        imagePromise = generateImage({ prompt: `A visually appealing image for a social media post about: ${input.topic}` });
    }
    
    const [textResult, imageUrl] = await Promise.all([textPromise, imagePromise]);
    
    const output = textResult.output;
    if (!output) {
      throw new Error('Failed to generate text content.');
    }
    
    return {
      postContent: output.postContent,
      suggestedHashtags: output.suggestedHashtags,
      imageUrl,
    };
  }
);
