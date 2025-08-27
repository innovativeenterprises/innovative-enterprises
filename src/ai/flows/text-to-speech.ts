
'use server';

/**
 * @fileOverview An AI flow that converts text to speech.
 * - textToSpeech - A function that takes text and returns an audio data URI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

export const TextToSpeechInputSchema = z.object({
  textToSpeak: z.string().describe("The text to be converted to speech."),
  voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).optional().default('onyx'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

export const TextToSpeechOutputSchema = z.object({
  audioUrl: z.string().describe("The data URI of the generated audio file."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;


/**
 * Converts PCM audio data to WAV format as a Base64 string.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

/**
 * Converts text to speech using a generative AI model.
 * @param input The text and desired voice.
 * @returns An object containing the data URI of the generated audio.
 */
export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // Using a fixed voice for now
          },
        },
      },
      prompt: input.textToSpeak,
    });

    if (!media) {
      throw new Error('No audio media was returned from the TTS model.');
    }
    
    // The response is Base64 encoded PCM data. We need to convert it to a playable format like WAV.
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);

    return {
        audioUrl: `data:audio/wav;base64,${wavBase64}`
    };
}
