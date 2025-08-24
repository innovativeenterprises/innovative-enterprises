'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/tender-response-assistant.ts';
import '@/ai/flows/ai-powered-faq.ts';
import '@/ai/flows/social-media-post-generator.ts';
import '@/ai/flows/legal-agent.ts';
import '@/ai/flows/cv-enhancement.ts';
import '@/ai/flows/letter-of-interest.ts';
import '@/ai/flows/work-order-analysis.ts';
import '@/ai/flows/train-agent.ts';
