
'use server';

/**
 * @fileOverview An AI agent that generates a digital business card image.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { generateImage } from './image-generator';
import { transformImage } from './image-transformer';

export const BusinessCardInputSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.string().email(),
  phone: z.string(),
  styleAndImagery: z.string(),
});
export type BusinessCardInput = z.infer<typeof BusinessCardInputSchema>;

export const BusinessCardOutputSchema = z.object({
  cardImageUrl: z.string().url().describe("A data URI of the final, generated business card image."),
});
export type BusinessCardOutput = z.infer<typeof BusinessCardOutputSchema>;

export const generateBusinessCard = ai.defineFlow(
  {
    name: 'generateBusinessCard',
    inputSchema: BusinessCardInputSchema,
    outputSchema: BusinessCardOutputSchema,
  },
  async (input) => {
    // Step 1: Generate a background image based on the style prompt.
    const imageResult = await generateImage({
      prompt: `Generate a high-quality, professional background image suitable for a digital business card. The style should be: "${input.styleAndImagery}". The image should have clean space for text. Do not include any text in this image. Dimensions should be 1024x576 pixels.`,
    });
    
    if (!imageResult.imageUrl) {
        throw new Error("Base image generation failed.");
    }

    // Step 2: Use the image-to-image model to overlay text.
    const textOverlayPrompt = `
      Overlay the following contact details onto the provided image to create a professional digital business card. Arrange the text cleanly and aesthetically. Use a legible, professional font. The text color should contrast well with the background.

      - Name (Large, bold font): "${input.name}"
      - Title (Smaller font, below name): "${input.title}"
      - Email (Small font): "${input.email}"
      - Phone (Small font): "${input.phone}"

      Ensure the final image size is 1024x576 pixels.
    `;
    
    const finalImageResult = await transformImage({
        baseImageUri: imageResult.imageUrl,
        prompt: textOverlayPrompt,
    });

    if (!finalImageResult.imageDataUri) {
      throw new Error('Text overlay transformation failed.');
    }

    return {
      cardImageUrl: finalImageResult.imageDataUri,
    };
  }
);
