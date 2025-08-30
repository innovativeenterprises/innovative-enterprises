/**
 * @fileOverview Schemas and types for the AI Theme Generator flow.
 */
import { z } from 'zod';

export const ThemeGeneratorInputSchema = z.object({
  prompt: z.string().describe('A text description of the desired theme (e.g., "A modern, professional theme with deep blues and a touch of gold").'),
});
export type ThemeGeneratorInput = z.infer<typeof ThemeGeneratorInputSchema>;

const ColorSchema = z.object({
  hsl: z.string().describe("The HSL value for the color, e.g., '226 44% 27%'."),
  hex: z.string().describe("The HEX value for the color, e.g., '#293462'."),
  description: z.string().describe("A brief description of the color's role."),
});

export const ThemeGeneratorOutputSchema = z.object({
  themeName: z.string().describe("A catchy name for the generated theme."),
  background: ColorSchema,
  foreground: ColorSchema,
  primary: ColorSchema,
  secondary: ColorSchema,
  accent: ColorSchema,
  destructive: ColorSchema,
  card: ColorSchema,
  border: ColorSchema,
  input: ColorSchema,
  ring: ColorSchema,
});
export type ThemeGeneratorOutput = z.infer<typeof ThemeGeneratorOutputSchema>;
