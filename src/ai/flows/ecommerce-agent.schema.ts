
/**
 * @fileOverview Schemas and types for the E-commerce AI Agent flow.
 */

import { z } from 'zod';
import { ProductSchema } from '@/lib/products.schema';
import { ai } from '@/ai/genkit';
import { initialProducts } from '@/lib/products';

export const EcommerceAgentInputSchema = z.object({
  query: z.string().describe("The user's query about products, categories, or store information."),
  availableCategories: z.array(z.string()).describe("A list of available product categories."),
});
export type EcommerceAgentInput = z.infer<typeof EcommerceAgentInputSchema>;

export const EcommerceAgentOutputSchema = z.object({
  response: z.string().describe('The helpful response from the AI shopping assistant.'),
  suggestedCategory: z.string().optional().describe('A specific product category suggested to the user.'),
  suggestedProducts: z.array(z.string()).optional().describe('A list of specific product names suggested to the user.'),
  shouldFuzzySearch: z.boolean().describe('Whether the UI should perform a fuzzy search with the user\'s query.'),
  itemAddedToCart: ProductSchema.optional().describe('The product that was successfully added to the user\'s cart.'),
  suggestedReplies: z.array(z.string()).optional().describe("A list of relevant follow-up questions or actions."),
});
export type EcommerceAgentOutput = z.infer<typeof EcommerceAgentOutputSchema>;

const allProducts = initialProducts;

export const addProductToCartTool = ai.defineTool(
    {
        name: 'addProductToCart',
        description: 'Use this tool when the user wants to buy, purchase, or add a specific product to their cart.',
        inputSchema: z.object({
            productName: z.string().describe("The exact name of the product to add to the cart."),
        }),
        outputSchema: z.object({
            product: ProductSchema.optional(),
            error: z.string().optional(),
        })
    },
    async ({ productName }) => {
        const product = allProducts.find(p => p.name.toLowerCase() === productName.toLowerCase());
        if (product) {
            return { product };
        }
        return { error: 'Product not found.' };
    }
);
