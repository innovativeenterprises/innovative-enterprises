
import { z } from 'zod';
import type { LucideIcon } from 'lucide-react';

/**
 * @fileOverview Zod schemas and types for Staff and AI Agents.
 */

const SocialsSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  github: z.string().optional(),
});
export type Socials = z.infer<typeof SocialsSchema>;

export const AgentSchema = z.object({
  name: z.string(),
  role: z.string(),
  description: z.string(),
  icon: z.string().describe('The name of a Lucide icon.'),
  type: z.enum(["Leadership", "AI Agent", "Staff"]),
  socials: SocialsSchema.optional(),
  href: z.string().optional(),
  photo: z.string().optional(),
  aiHint: z.string().optional(),
  enabled: z.boolean(),
});
export type Agent = z.infer<typeof AgentSchema>;

export const AgentCategorySchema = z.object({
    category: z.string(),
    agents: z.array(AgentSchema),
});
export type AgentCategory = z.infer<typeof AgentCategorySchema>;
