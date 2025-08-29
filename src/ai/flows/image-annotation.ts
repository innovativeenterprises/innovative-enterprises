
'use server';

/**
 * @fileOverview An AI agent that annotates an image based on a text prompt.
 * - annotateImage - A function that overlays text or icons on a base image.
 */

import { ai } from '@/ai/genkit';
import { 
    ImageAnnotationInput, 
    ImageAnnotationOutput,
    ImageAnnotationOutputSchema
} from './image-annotation.schema';


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

ai.defineFlow(
    {
        name: 'annotateImageFlow',
        inputSchema: ImageAnnotationInput,
        outputSchema: ImageAnnotationOutputSchema,
    },
    async (input) => annotateImage(input)
);
