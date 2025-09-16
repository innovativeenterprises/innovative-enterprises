
'use server';

/**
 * @fileOverview An AI flow that converts text to speech.
 * - textToSpeech - a function that takes text and returns an audio data URI.
 */

import { ai } from '@/ai/genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

export const TextToSpeechInputSchema = z.object({
  textToSpeak: z.string().min(1, "Text to speak cannot be empty."),
  voice: z.enum(['onyx', 'nova', 'echo', 'alloy', 'fable', 'shimmer']).optional(),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

export const TextToSpeechOutputSchema = z.object({
  audioUrl: z.string().url().describe("The data URI of the generated audio file."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;


/**
 * Converts PCM audio data to WAV format as a Base64 string.
 */
async function toWav(pcmData: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels: 1,
      sampleRate: 24000,
      bitDepth: 16,
    });

    writer.on('data', (chunk) => bufs.push(chunk));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));
    writer.on('error', reject);
    
    let bufs: Buffer[] = [];
    writer.write(pcmData);
    writer.end();
  });
}

export const textToSpeech = ai.defineFlow(
    {
        name: 'textToSpeechFlow',
        inputSchema: TextToSpeechInputSchema,
        outputSchema: TextToSpeechOutputSchema,
    },
    async ({ textToSpeak }) => {
        const { media } = await ai.generate({
          model: googleAI.model('gemini-2.5-flash-preview-tts'),
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Algenib' }, 
              },
            },
          },
          prompt: textToSpeak,
        });

        if (!media?.url) {
          throw new Error('No audio media was returned from the TTS model.');
        }
        
        const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
        const wavBase64 = await toWav(audioBuffer);

        return {
            audioUrl: `data:audio/wav;base64,${wavBase64}`
        };
    }
);
