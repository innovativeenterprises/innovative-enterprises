
'use server';

/**
 * @fileOverview An AI agent that generates images from text prompts.
 *
 * - generateImage - A function that generates an image.
 */

import { ai } from '@/ai/genkit';
import { GenerateImageInput, GenerateImageInputSchema, GenerateImageOutput, GenerateImageOutputSchema } from './image-generator.schema';

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
    const { media } = await ai.generate({
        model: 'googleai/gemini-pro-vision',
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

ai.defineFlow(
    {
        name: 'generateImageFlow',
        inputSchema: GenerateImageInputSchema,
        outputSchema: GenerateImageOutputSchema,
    },
    async (input) => generateImage(input)
);
