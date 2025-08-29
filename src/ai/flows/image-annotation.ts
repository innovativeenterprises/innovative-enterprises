
'use server';

/**
 * @fileOverview An AI agent that annotates an image based on a text prompt.
 * - annotateImage - A function that overlays text or icons on a base image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const ImageAnnotationInputSchema = z.object({
  baseImageUri: z.string().describe("The base image to be annotated, as a data URI."),
  prompt: z.string().describe('A detailed text description of the annotations to apply.'),
});
export type ImageAnnotationInput = z.infer<typeof ImageAnnotationInputSchema>;

export const ImageAnnotationOutputSchema = z.object({
  imageDataUri: z.string().describe("The new, annotated image as a data URI."),
});
export type ImageAnnotationOutput = z.infer<typeof ImageAnnotationOutputSchema>;


export async function annotateImage(input: ImageAnnotationInput): Promise<ImageAnnotationOutput> {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
            { media: { url: input.baseImageUri } },
            { text: input.prompt },
        ],
        config: {
            responseModalities: ['IMAGE'], // Only expect an image back
        },
    });

    if (!media?.url) {
        throw new Error('Image annotation failed to return a valid image URL.');
    }
    
    return { imageDataUri: media.url };
}
