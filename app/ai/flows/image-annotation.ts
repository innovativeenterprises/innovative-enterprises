
'use server';

/**
 * @fileOverview An AI agent that analyzes an image to estimate an object's dimensions and annotates it.
 * - annotateImage - A function that takes an image and returns an analysis and annotated image.
 */

import { ai } from '@/ai/genkit';
import { 
    ImageAnnotatorInputSchema,
    ImageAnnotatorOutputSchema
} from './image-annotation.schema';
import type { ImageAnnotatorInput, ImageAnnotatorOutput } from './image-annotation.schema';
import { z } from 'zod';

const promptText = `You are a sophisticated computer vision AI specializing in photogrammetry and technical illustration. Your task is to analyze an image of an object or floor plan and provide estimated real-world measurements and annotations.

**User Instructions (Optional):**
{{{prompt}}}

**Your Tasks:**
1.  **Identify Object(s):** Identify the primary object or context in the image (e.g., "Laptop", "Coffee Mug", "Floor Plan").
2.  **Estimate Dimensions:** Based on common real-world sizes for this type of object, estimate its dimensions in a relevant metric unit (e.g., cm, m). Provide values for height, width, and depth if it's an object. If it's a floor plan, provide overall building dimensions.
3.  **Identify Other Metrics:** Note any other relevant physical properties you can infer, like estimated volume, weight, or key features visible.
4.  **Generate Annotated Image:** Create a new version of the input image. On this new image, you MUST draw clean, professional-looking bounding boxes, labels, or icons to illustrate your analysis. For example:
    *   For an object, draw dimension lines and labels for height, width, and depth.
    *   For a floor plan with a request like "place fire extinguishers", overlay professional, semi-transparent fire extinguisher icons in logical locations (near exits, kitchens).
    *   The annotations should look like they are from engineering or design software.

Return the structured data and the newly generated annotated image.
`;

const prompt = ai.definePrompt({
  name: 'imageAnnotationPrompt',
  input: {
    schema: z.object({
      baseImageUri: z.string().url(),
      prompt: z.string(),
    }),
  },
  output: {
    schema: ImageAnnotatorOutputSchema,
  },
  prompt: promptText,
});


export const annotateImage = ai.defineFlow(
    {
        name: 'annotateImageFlow',
        inputSchema: ImageAnnotatorInputSchema,
        outputSchema: ImageAnnotatorOutputSchema,
    },
    async (input) => {
        const { media, output } = await ai.generate({
            model: 'googleai/gemini-2.5-flash-image-preview',
            prompt: [
                { media: { url: input.baseImageUri } },
                { text: prompt.prompt.replace("{{{prompt}}}", input.prompt || 'Analyze the main object in the image.') },
            ],
            output: {
                format: 'json',
                schema: ImageAnnotatorOutputSchema,
            },
            config: {
                responseModalities: ['IMAGE', 'TEXT'],
            },
        });

        if (!output || !media?.url) {
            throw new Error('Image analysis failed to return a valid response.');
        }
        
        return {
            ...output,
            annotatedImageUri: media.url,
        };
    }
);
