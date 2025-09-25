
import { z } from 'zod';

export const ThemeGeneratorInputSchema = z.object({
  prompt: z.string().min(10, "Please provide a more detailed description."),
});
export type ThemeGeneratorInput = z.infer<typeof ThemeGeneratorInputSchema>;

const ColorSchema = z.object({
    hsl: z.string().describe("The HSL value in the format 'H S% L%'."),
    hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex code."),
    description: z.string(),
});

export const ThemeGeneratorOutputSchema = z.object({
  themeName: z.string(),
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
