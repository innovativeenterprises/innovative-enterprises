
'use server';

/**
 * @fileOverview An AI agent that generates a unique, human-readable coupon code.
 * - generateCouponCode - a function that creates a coupon code based on discount details.
 */

import { ai } from '@/ai/genkit';
import {
    CouponGeneratorInput,
    CouponGeneratorInputSchema,
    CouponGeneratorOutput,
    CouponGeneratorOutputSchema,
} from './coupon-generator.schema';

export async function generateCouponCode(input: CouponGeneratorInput): Promise<CouponGeneratorOutput> {
  return couponGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'couponGeneratorPrompt',
  input: { schema: CouponGeneratorInputSchema },
  output: { schema: CouponGeneratorOutputSchema },
  prompt: `You are an expert marketing assistant. Your task is to generate a short, memorable, and relevant coupon code based on the details of a promotion.

**Promotion Details:**
- **Description:** {{{description}}}
- **Discount Type:** {{{discountType}}}
- **Discount Value:** {{{discountValue}}}{{#if (eq discountType 'percentage')}}%{{else}} OMR{{/if}}
{{#if usageLimit}}
- **Usage Limit:** {{{usageLimit}}} uses
{{/if}}

**Instructions:**
1.  Analyze the promotion description to understand the theme (e.g., "Summer Sale," "New User Discount," "Black Friday").
2.  Create a coupon code that is uppercase, contains no spaces, and is easy for a human to type.
3.  The code should ideally combine the theme with the discount value. For example:
    -   A 25% summer sale could be \`SUMMER25\`.
    -   A 10 OMR discount for new users could be \`WELCOME10\`.
    -   A 50% Black Friday discount could be \`BF50\`.
4.  The code should be between 6 and 12 characters long.

Return ONLY the generated code in the 'couponCode' field.
`,
});

const couponGeneratorFlow = ai.defineFlow(
  {
    name: 'couponGeneratorFlow',
    inputSchema: CouponGeneratorInputSchema,
    outputSchema: CouponGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
