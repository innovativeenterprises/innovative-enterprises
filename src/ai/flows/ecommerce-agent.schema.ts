
'use server';

import {z} from 'zod';
import { initialStoreProducts } from '@/lib/products';
import { type Product } from '@/lib/products.schema';
import { ai } from '@/ai/genkit';

export const EcommerceAgentInputSchema = z.object({
  query: z.string(),
  availableCategories: z.array(z.string()),
});
export type EcommerceAgentInput = z.infer<typeof EcommerceAgentInputSchema>;

export const EcommerceAgentOutputSchema = z.object({
  response: z.string(),
  suggestedCategory: z.string().optional(),
  suggestedProducts: z.array(z.string()).optional(),
  shouldFuzzySearch: z.boolean().default(false),
  suggestedReplies: z.array(z.string()).optional(),
  itemAddedToCart: z.custom<Product>().optional(),
});
export type EcommerceAgentOutput = z.infer<typeof EcommerceAgentOutputSchema>;

// Tool to add a product to the cart
export const addProductToCartTool = ai.defineTool({
  name: 'addProductToCart',
  description: 'Finds a product by name from the store inventory and adds it to the user\'s shopping cart.',
  inputSchema: z.object({ productName: z.string() }),
  outputSchema: z.object({ product: z.custom<Product>().optional(), success: z.boolean() }),
}, async ({ productName }) => {
    const product = initialStoreProducts.find(p => p.name.toLowerCase() === productName.toLowerCase());
    if (product) {
      return { product, success: true };
    }
    return { success: false };
});
