
/**
 * @fileOverview Schemas and types for the social media post generator flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the social media post generation AI flow. These are
 * separated to allow client-side components to import them without
 * pulling in server-only code.
 *
 * - GenerateSocialMediaPostInputSchema - Zod schema for the input.
 * - GenerateSocialMediaPostInput - TypeScript type for the input.
 * - GenerateSocialMediaPostOutputSchema - Zod schema for the output.
 * - GenerateSocialMediaPostOutput - TypeScript type for the output.
 */

import {z} from 'zod';

export const GenerateSocialMediaPostInputSchema = z.object({
  topic: z.string().describe('The topic for the social media post.'),
  platform: z.enum(['Twitter', 'LinkedIn', 'Facebook', 'Instagram', 'WhatsApp', 'Tender Response']).describe('The target social media platform or content type.'),
  tone: z.enum(['Professional', 'Casual', 'Witty', 'Enthusiastic']).describe('The desired tone of the post.'),
  generateImage: z.boolean().optional().describe('Whether to generate a suggested image for the post.'),
});
export type GenerateSocialMediaPostInput = z.infer<typeof GenerateSocialMediaPostInputSchema>;

export const GenerateSocialMediaPostOutputSchema = z.object({
  postContent: z.string().describe('The generated social media post content.'),
  suggestedHashtags: z.array(z.string()).describe('A list of suggested hashtags.'),
  imageUrl: z.string().optional().describe('A data URI of a suggested image for the post.'),
});
export type GenerateSocialMediaPostOutput = z.infer<typeof GenerateSocialMediaPostOutputSchema>;
