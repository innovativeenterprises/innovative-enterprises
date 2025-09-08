
'use server';
import { config } from 'dotenv';
config();

// This is the main entry point for all of your Genkit flows.
// It is exposed as an HTTP endpoint by the genkit-next plugin.
import '@/ai/genkit';
