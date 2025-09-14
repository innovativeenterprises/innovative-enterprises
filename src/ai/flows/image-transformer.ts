
'use server';

/**
 * @fileOverview An AI agent that annotates or transforms an image based on a text prompt.
 * - transformImage - A function that overlays text, icons, or generates a new image based on a base image.
 */

import { ai } from '@/ai/genkit';
import { ImageTransformerInput, ImageTransformerInputSchema, ImageTransformerOutputSchema } from './image-transformer.schema';
import { z } from 'zod';


export const transformImage = ai.defineFlow(
    {
        name: 'transformImageFlow',
        inputSchema: ImageTransformerInputSchema,
        outputSchema: ImageTransformerOutputSchema,
    },
    async (input) => {
        const { output } = await ai.generate({
            model: 'googleai/gemini-2.5-flash-image-preview',
            prompt: [
                { media: { url: input.baseImageUri } },
                { text: input.prompt },
            ],
            output: {
                format: 'json',
                schema: ImageTransformerOutputSchema.extend({ reasoning: z.string().optional() }),
            },
            config: {
                responseModalities: ['IMAGE', 'TEXT'],
            },
        });

        if (!output?.imageDataUri) {
            throw new Error('Image transformation failed to return a valid image URL.');
        }
        
        return { imageDataUri: output.imageDataUri };
    }
);
