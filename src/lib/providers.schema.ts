
import { z } from 'zod';

/**
 * @fileOverview A Zod schema for the Provider data structure.
 * This ensures type safety and provides a single source of truth for the
 * data shape used across the application.
 */

const CommissionSchema = z.object({
  clientId: z.string(),
  rate: z.number().min(0).max(1), // e.g., 0.05 for 5%
});

export const ProviderSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name is required"),
  email: z.string().email("A valid email is required"),
  services: z.string().min(3, "Services are required"),
  status: z.enum(['Vetted', 'Pending Review', 'On Hold']),
  portfolio: z.string().url("A valid URL is required").optional().or(z.literal('')),
  notes: z.string().optional(),
  subscriptionTier: z.enum(['Monthly', 'Yearly', 'Lifetime', 'None']),
  subscriptionExpiry: z.coerce.date().optional(),
  commissions: z.array(CommissionSchema).optional(),
});
