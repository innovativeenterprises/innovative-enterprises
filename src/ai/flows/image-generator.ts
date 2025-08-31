
'use server';

/**
 * @fileOverview An AI agent that generates images from text prompts.
 *
 * - generateImage - A function that generates an image.
 */

import { ai } from '@/ai/genkit';
import { GenerateImageInput, GenerateImageInputSchema, GenerateImageOutput, GenerateImageOutputSchema } from './image-generator.schema';


export async function generateImage(input: GenerateImageInput): Promise<string> {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: input.prompt,
        config: {
            responseModalities: ['IMAGE', 'TEXT'], // MUST provide both TEXT and IMAGE
        },
    });

    if (!media?.url) {
        throw new Error('Image generation failed to return a valid image URL.');
    }
    
    return media.url;
}

ai.defineFlow(
    {
        name: 'generateImageFlow',
        inputSchema: GenerateImageInputSchema,
        outputSchema: GenerateImageOutputSchema,
    },
    async (input) => {
        const imageUrl = await generateImage(input);
        return { imageUrl };
    }
);
