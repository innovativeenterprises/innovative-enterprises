

'use server';

import {z} from 'zod';

export const platformEnum = z.enum(['Twitter', 'LinkedIn', 'Facebook', 'Instagram', 'WhatsApp']);
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
