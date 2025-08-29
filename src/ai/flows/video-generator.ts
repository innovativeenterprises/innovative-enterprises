
'use server';
/**
 * @fileOverview An AI agent that generates video from text prompts using the Veo model.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import * as fs from 'fs';
import { Readable } from 'stream';
import type { MediaPart } from 'genkit';

const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('A detailed text description of the video to generate.'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  videoDataUri: z.string().describe('The generated video as a data URI.'),
  contentType: z.string().describe('The content type of the video (e.g., video/mp4).'),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;


/**
 * Fetches a video from a URL (which requires an API key) and returns it as a Base64-encoded data URI.
 */
async function getVideoAsDataUri(videoUrl: string): Promise<{ videoDataUri: string; contentType: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }

  const response = await fetch(`${videoUrl}&key=${apiKey}`);
  
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || 'video/mp4';
  const reader = response.body.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const buffer = Buffer.concat(chunks);
  const base64Data = buffer.toString('base64');
  
  return { videoDataUri: `data:${contentType};base64,${base64Data}`, contentType };
}


export const generateVideo = ai.defineFlow(
    {
        name: 'generateVideo',
        inputSchema: GenerateVideoInputSchema,
        outputSchema: GenerateVideoOutputSchema,
    },
    async (input) => {
        let { operation } = await ai.generate({
            model: googleAI.model('veo-2.0-generate-001'),
            prompt: input.prompt,
            config: {
            durationSeconds: 5,
            aspectRatio: '16:9',
            },
        });

        if (!operation) {
            throw new Error('Expected the model to return an operation for video generation.');
        }

        // Poll the operation status until it's done. This can take up to a minute.
        while (!operation.done) {
            // Wait for 5 seconds before checking the status again.
            await new Promise((resolve) => setTimeout(resolve, 5000));
            operation = await ai.checkOperation(operation);
            console.log(`Checking video generation status... Done: ${operation.done}`);
        }

        if (operation.error) {
            throw new Error(`Failed to generate video: ${operation.error.message}`);
        }

        const videoPart = operation.output?.message?.content.find((p): p is MediaPart => !!p.media);

        if (!videoPart || !videoPart.media?.url) {
            throw new Error('Failed to find the generated video in the operation result.');
        }
        
        // The returned URL is temporary and requires the API key for access.
        // We fetch it and convert to a data URI to send to the client.
        const { videoDataUri, contentType } = await getVideoAsDataUri(videoPart.media.url);
        
        return { videoDataUri, contentType };
    }
);
