
'use server';

/**
 * @fileOverview An AI agent that analyzes an image to estimate an object's dimensions and annotates it.
 * - annotateImage - A function that takes an image and returns an analysis and annotated image.
 */

import { ai } from '@/ai/genkit';
import { 
    ImageAnnotatorInput, 
    ImageAnnotatorOutput,
    ImageAnnotatorInputSchema,
    ImageAnnotatorOutputSchema
} from './image-annotation.schema';


const prompt = ai.definePrompt({
  name: 'imageMeasurementPrompt',
  input: { schema: ImageAnnotatorInputSchema },
  output: { schema: ImageAnnotatorOutputSchema },
  prompt: `You are a sophisticated computer vision AI specializing in photogrammetry. Your task is to analyze an image of an object and provide estimated real-world measurements.

**Image to Analyze:**
{{media url=baseImageUri}}

**User Instructions (Optional):**
{{#if prompt}}
  {{{prompt}}}
{{else}}
  Analyze the main object in the image.
{{/if}}

**Your Tasks:**
1.  **Identify the Object:** Identify the primary object in the image (e.g., "Laptop", "Coffee Mug", "Cardboard Box").
2.  **Estimate Dimensions:** Based on common real-world sizes for this type of object, estimate its dimensions in a relevant metric unit (e.g., cm, m). Provide values for height, width, and depth.
3.  **Identify Other Metrics:** Note any other relevant physical properties you can infer, like estimated volume or weight.
4.  **Generate Annotated Image:** Create a new version of the input image. On this new image, you MUST draw clean, professional-looking bounding boxes and add clear labels showing the estimated height, width, and depth. The annotations should look like they are from engineering software.

Return the structured data and the newly generated annotated image.
`,
});


export async function annotateImage(input: ImageAnnotatorInput): Promise<ImageAnnotatorOutput> {
    const { output } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
            { media: { url: input.baseImageUri } },
            { text: "Analyze the image to estimate the object's dimensions. First, identify the main object. Then, estimate its height, width, and depth in metric units based on common real-world sizes. Finally, create a new image where you overlay clean, professional-looking bounding boxes and dimension labels onto the object." },
        ],
        config: {
            responseModalities: ['IMAGE', 'JSON'],
            jsonOutput: { schema: ImageAnnotatorOutputSchema }
        },
    });

    if (!output) {
        throw new Error('Image analysis failed to return a valid response.');
    }
    
    return output;
}

ai.defineFlow(
    {
        name: 'annotateImageFlow',
        inputSchema: ImageAnnotatorInputSchema,
        outputSchema: ImageAnnotatorOutputSchema,
    },
    async (input) => annotateImage(input)
);
