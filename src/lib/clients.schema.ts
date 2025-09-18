import { z } from 'zod';

export const ClientSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string(),
  aiHint: z.string(),
});
export type Client = z.infer<typeof ClientSchema>;


export const TestimonialSchema = z.object({
  id: z.string(),
  quote: z.string(),
  author: z.string(),
  company: z.string(),
  avatarId: z.string(),
});
export type Testimonial = z.infer<typeof TestimonialSchema>;