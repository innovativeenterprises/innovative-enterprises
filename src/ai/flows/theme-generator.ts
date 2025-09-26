

'use server';

/**
 * @fileOverview An AI agent that generates a full color theme for the application.
 */

import { ai } from '@/ai/genkit';
import {
    ThemeGeneratorInput,
    ThemeGeneratorInputSchema,
    ThemeGeneratorOutput,
    ThemeGeneratorOutputSchema,
} from './theme-generator.schema';

export async function generateTheme(input: ThemeGeneratorInput): Promise<ThemeGeneratorOutput> {
  return themeGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'themeGeneratorPrompt',
  input: { schema: ThemeGeneratorInputSchema },
  output: { schema: ThemeGeneratorOutputSchema },
  prompt: `You are an expert UI/UX designer and color theorist. Your task is to create a complete, accessible, and beautiful color theme for a web application based on a user's prompt. You MUST provide values for all fields.

**User's Theme Prompt:**
"{{{prompt}}}"

**Instructions:**
1.  **Analyze the Prompt:** Understand the mood, style, and key colors the user wants.
2.  **Generate a Palette:** Create a harmonious and accessible color palette. It must include distinct colors for:
    *   **background:** The main page background. Usually very light or very dark.
    *   **foreground:** The main text color. Must have high contrast with the background.
    *   **primary:** The main brand color, used for buttons, links, and important elements.
    *   **secondary:** A less prominent color for secondary buttons or elements.
    *   **accent:** A bright, eye-catching color for calls-to-action or special highlights.
    *   **destructive:** A color for error messages and delete actions (usually red).
    *   **card:** The background color for card-like components.
    *   **border:** The color for borders and dividers.
    *   **input:** The background color for input fields.
    *   **ring:** The color for focus rings on interactive elements.
3.  **Provide HSL and HEX:** For each color, you MUST provide both the HSL value (in the format \`H S% L%\`) and the corresponding HEX code.
4.  **Describe Each Color:** Briefly describe the purpose of each color in the theme.
5.  **Name the Theme:** Give the theme a creative and descriptive name.

Return the complete theme object in the specified structured JSON format. Ensure all fields are populated.
`,
});

const themeGeneratorFlow = ai.defineFlow(
  {
    name: 'themeGeneratorFlow',
    inputSchema: ThemeGeneratorInputSchema,
    outputSchema: ThemeGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

