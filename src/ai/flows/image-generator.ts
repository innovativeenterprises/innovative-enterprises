
'use server';

/**
 * @fileOverview An AI agent that generates images from text prompts.
 *
 * - generateImage - A function that generates an image.
 */

import { ai } from '@/ai/genkit';
import { GenerateImageInput, GenerateImageInputSchema, GenerateImageOutputSchema } from './image-generator.schema';

export const generateImage = ai.defineFlow(
    {
        name: 'generateImageFlow',
        inputSchema: GenerateImageInputSchema,
        outputSchema: GenerateImageOutputSchema.pick({ imageUrl: true }), // The flow itself should conform to the output schema
    },
    async (input) => {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: input.prompt,
            config: {
                responseModalities: ['IMAGE'],
            },
        });

        if (!media?.url) {
            throw new Error('Image generation failed to return a valid image URL.');
        }
        
        return { imageUrl: media.url };
    }
);
