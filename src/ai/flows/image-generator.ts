'use server';

/**
 * @fileOverview An AI agent that generates images from text prompts.
 *
 * - generateImage - A function that generates an image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('A text description of the image to generate.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<string> {
    const { media } = await ai.generate({
        // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: input.prompt,
        config: {
            responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
        },
    });

    if (!media?.url) {
        throw new Error('Image generation failed to return a valid image URL.');
    }
    
    return media.url;
}
