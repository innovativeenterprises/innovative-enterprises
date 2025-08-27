
'use server';

/**
 * @fileOverview An AI agent that generates short video clips from text prompts using Veo.
 *
 * - generateVideo - A function that generates a video and returns its data URI.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import * as fs from 'fs';
import { Readable } from 'stream';

const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('A text description of the video to generate.'),
  durationSeconds: z.number().optional().default(5),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

export async function generateVideo(input: GenerateVideoInput): Promise<string> {
    
  let operation;
  let lastError: any = null;
  const maxRetries = 3;

  // Add a retry loop for initial generation call
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
       const generationResult = await ai.generate({
          model: googleAI.model('veo-2.0-generate-001'),
          prompt: input.prompt,
          config: {
          durationSeconds: input.durationSeconds,
          aspectRatio: '16:9',
          },
      });
      operation = generationResult.operation;
      if (operation) {
        lastError = null; // Clear error on success
        break; // Exit loop on success
      }
    } catch (e) {
        lastError = e;
        console.error(`Video generation attempt ${attempt} failed:`, e);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Wait before retrying
        }
    }
  }

  if (lastError || !operation) {
      console.error("All video generation attempts failed.", lastError);
      throw new Error(`Failed to start video generation after ${maxRetries} attempts. Please try again later.`);
  }

  // Wait until the operation completes. Note that this may take some time.
  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Check every 5 seconds
     try {
        operation = await ai.checkOperation(operation);
     } catch (e) {
         console.error("Failed to check operation status", e);
         // Optional: decide if you want to retry or fail here
     }
  }

  if (operation.error) {
    console.error('Video generation operation failed:', operation.error);
    throw new Error('Failed to generate video: ' + operation.error.message);
  }

  const video = operation.output?.message?.content.find((p) => !!p.media);
  if (!video || !video.media?.url) {
    throw new Error('Failed to find the generated video in the operation result');
  }
  
  // The URL returned is temporary and requires an API key to download.
  // We'll fetch it and convert to a data URI to send to the client.
  const fetch = (await import('node-fetch')).default;
  const videoDownloadResponse = await fetch(
    `${video.media.url}&key=${process.env.GEMINI_API_KEY}`
  );

  if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
    throw new Error(`Failed to download video file. Status: ${videoDownloadResponse.status}`);
  }

  const videoBuffer = await videoDownloadResponse.arrayBuffer();
  const base64Video = Buffer.from(videoBuffer).toString('base64');
  
  const contentType = video.media.contentType || 'video/mp4';
  
  return `data:${contentType};base64,${base64Video}`;
}
