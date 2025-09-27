import { genkit, GenerationCommon } from 'genkit';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';
import { configureGenkit } from 'genkit';

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
  model: 'googleai/gemini-1.5-flash',
  // New logging options in Genkit v1.x
  telemetry: {
    instrumentation: {
      // open-telemetry is used by default
    },
    logging: {
      // console is used by default
    },
  },
});
