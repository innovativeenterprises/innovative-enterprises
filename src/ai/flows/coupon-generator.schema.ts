/**
 * @fileOverview Schemas and types for the Coupon Code Generator AI flow.
 */

import { z } from 'zod';

export const CouponGeneratorInputSchema = z.object({
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive("Discount value must be positive."),
  description: z.string().min(5, "Please provide a brief description for context."),
  usageLimit: z.number().int().positive().optional().describe("An optional limit on how many times the coupon can be used."),
});
export type CouponGeneratorInput = z.infer<typeof CouponGeneratorInputSchema>;


export const CouponGeneratorOutputSchema = z.object({
  couponCode: z.string().describe("The generated, human-readable coupon code."),
});
export type CouponGeneratorOutput = z.infer<typeof CouponGeneratorOutputSchema>;
