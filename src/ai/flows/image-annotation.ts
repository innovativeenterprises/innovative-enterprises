
'use server';

/**
 * @fileOverview An AI agent that annotates or transforms an image based on a text prompt.
 * - annotateImage - A function that overlays text, icons, or generates a new image based on a base image.
 */

import { ai } from '@/ai/genkit';
import { 
    ImageAnnotatorInput, 
    ImageAnnotatorOutput,
    ImageAnnotatorInputSchema,
    ImageAnnotatorOutputSchema
} from './image-annotation.schema';


export async function annotateImage(input: ImageAnnotatorInput): Promise<ImageAnnotatorOutput> {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
            { media: { url: input.baseImageUri } },
            { text: input.prompt },
        ],
        config: {
            responseModalities: ['IMAGE', 'TEXT'], // MUST provide both TEXT and IMAGE
        },
    });

    if (!media?.url) {
        throw new Error('Image transformation failed to return a valid image URL.');
    }
    
    return { imageDataUri: media.url };
}

ai.defineFlow(
    {
        name: 'annotateImageFlow',
        inputSchema: ImageAnnotatorInputSchema,
        outputSchema: ImageAnnotatorOutputSchema,
    },
    async (input) => annotateImage(input)
);
