

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
  output: {schema: GenerateSocialMediaPostOutputSchema.pick({ posts: true })},
  prompt: `You are an expert social media manager. Your task is to generate compelling content for multiple social media platforms based on a single topic.

**Topic:**
{{{topic}}}

**Tone:**
{{{tone}}}

**Platforms to generate content for:**
{{#each platforms}}
- {{this}}
{{/each}}

**Instructions:**
For each platform listed above, create a post that is engaging and perfectly tailored to that platform's audience and format.

- **LinkedIn:** Professional tone, longer format, focus on business value, use professional hashtags.
- **Twitter:** Concise, witty, under 280 characters, use punchy hashtags.
- **Facebook:** Casual and engaging, can be longer, ask questions to encourage comments.
- **Instagram:** Visually focused caption, use plenty of relevant hashtags. Should be shorter and more personal.
- **WhatsApp:** Very casual, conversational, and direct, like a message to a friend. No hashtags.

For each platform, also provide a list of relevant hashtags to maximize reach (except for WhatsApp). Return the results as an array of 'posts' objects.
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
        imagePromise = generateImage({ prompt: `A visually appealing image for a social media campaign about: ${input.topic}` });
    }
    
    const [textResult, imageUrl] = await Promise.all([textPromise, imagePromise]);
    
    const output = textResult.output;
    if (!output || !output.posts) {
      throw new Error('Failed to generate text content.');
    }
    
    return {
      posts: output.posts,
      imageUrl,
    };
  }
);
