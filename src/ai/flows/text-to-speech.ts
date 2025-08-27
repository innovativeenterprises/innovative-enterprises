
'use server';

/**
 * @fileOverview An AI flow that converts text to speech.
 * - textToSpeech - a function that takes text and returns an audio data URI.
 */

import { ai } from '@/ai/genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';
import { TextToSpeechInput, TextToSpeechOutput } from './text-to-speech.schema';

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
            // The schema lists several voices, but the API may have different names.
            // Using a high-quality prebuilt voice for consistency.
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, 
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
