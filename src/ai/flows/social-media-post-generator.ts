
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
import { generateImage } from './image-generator';
import {z} from 'zod';

const platformEnum = z.enum(['Twitter', 'LinkedIn', 'Facebook', 'Instagram', 'WhatsApp']);
export type Platform = z.infer<typeof platformEnum>;

export const GenerateSocialMediaPostInputSchema = z.object({
  topic: z.string().describe('The topic for the social media post.'),
  platforms: z.array(platformEnum).min(1, 'Please select at least one platform.'),
  tone: z.enum(['Professional', 'Casual', 'Witty', 'Enthusiastic']).describe('The desired tone of the post.'),
  generateImage: z.boolean().optional().describe('Whether to generate a suggested image for the post.'),
  promotionUrl: z.string().url().optional().describe("An optional URL to promote within the post."),
  beforeScore: z.number().optional().describe("The user's ATS score before using the tool."),
  afterScore: z.number().optional().describe("The user's ATS score after using the tool."),
});
export type GenerateSocialMediaPostInput = z.infer<typeof GenerateSocialMediaPostInputSchema>;

export const GeneratedPostSchema = z.object({
  platform: platformEnum.describe('The platform for which this content was generated.'),
  postContent: z.string().describe('The generated social media post content, tailored for the platform.'),
  suggestedHashtags: z.array(z.string()).describe('A list of suggested hashtags for the platform.'),
});
export type GeneratedPost = z.infer<typeof GeneratedPostSchema>;


export const GenerateSocialMediaPostOutputSchema = z.object({
  posts: z.array(GeneratedPostSchema).describe('A list of generated posts, one for each requested platform.'),
  imageUrl: z.string().optional().describe('A data URI of a suggested image for the post.'),
});
export type GenerateSocialMediaPostOutput = z.infer<typeof GenerateSocialMediaPostOutputSchema>;


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

{{#if promotionUrl}}
**Promotional URL to include:**
{{{promotionUrl}}}
{{/if}}

{{#if beforeScore}}
**Performance Metrics to Highlight:**
- **Before ATS Score:** {{{beforeScore}}}
- **After ATS Score:** {{{afterScore}}}
{{/if}}

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

**Crucially, if performance metrics are provided, you MUST incorporate them naturally.** For example: "Thrilled to share that my new CV is ready! My ATS score jumped from {{{beforeScore}}} to a whopping {{{afterScore}}} thanks to the AI tools at Innovative Enterprises."

**Crucially, if a 'Promotional URL' is provided, you MUST naturally weave it into the post content.** For example, you could add a sentence like "Check out the tool I used: {{{promotionUrl}}}" or "Want to create your own? Visit {{{promotionUrl}}}".

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
    let imagePromise: Promise<{ imageUrl: string; } | undefined> | undefined;

    if (input.generateImage) {
        imagePromise = generateImage({ prompt: `A visually appealing image for a social media campaign about: ${input.topic}` });
    }
    
    const [textResult, imageResult] = await Promise.all([textPromise, imagePromise]);
    
    const output = textResult.output;
    if (!output || !output.posts) {
      throw new Error('Failed to generate text content.');
    }
    
    return {
      posts: output.posts,
      imageUrl: imageResult?.imageUrl,
    };
  }
);

    