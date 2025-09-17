
'use server';

/**
 * @fileOverview An AI agent that transforms educational content into gamified materials.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GamifiedLessonInputSchema = z.object({
  documentUri: z.string().url().describe("A data URI of the lesson document (PDF, TXT, etc.)."),
  topic: z.string().describe("The main topic of the lesson."),
  targetAudience: z.string().describe("The target audience, e.g., 'Grade 5 students' or 'University undergraduates'."),
});

const GamifiedLessonOutputSchema = z.object({
  interactiveBookHtml: z.string().describe("HTML content for an interactive, gamified version of the lesson."),
  flashcards: z.array(z.object({
    term: z.string().describe("A key term from the lesson."),
    definition: z.string().describe("A concise definition of the term."),
  })).describe("A list of flashcards for key terms."),
  powerpointOutline: z.object({
    slides: z.array(z.object({
      title: z.string().describe("The title of the slide."),
      bulletPoints: z.array(z.string()).describe("A list of key bullet points for the slide."),
    })),
  }).describe("A structured outline for a PowerPoint presentation."),
  summaryPdfContent: z.string().describe("A concise summary of the lesson in Markdown format, suitable for a PDF study guide."),
});

export type GamifiedLessonOutput = z.infer<typeof GamifiedLessonOutputSchema>;

const prompt = ai.definePrompt({
  name: 'gamifyLessonPrompt',
  input: { schema: GamifiedLessonInputSchema },
  output: { schema: GamifiedLessonOutputSchema },
  prompt: `You are an expert instructional designer specializing in gamification. Your task is to transform a standard educational document into a suite of engaging learning materials tailored for a specific audience.

**Lesson Details:**
- **Topic:** {{{topic}}}
- **Target Audience:** {{{targetAudience}}}
- **Lesson Document:** {{media url=documentUri}}

**Instructions:**

1.  **Analyze Document:** Thoroughly read and understand the provided lesson document.

2.  **Generate Interactive Book (HTML):**
    *   Create a simple but engaging HTML structure for an interactive book.
    *   Break the content into logical sections with clear headings (\`<h3>\`).
    *   For key concepts, use \`<details>\` and \`<summary>\` tags to create clickable "reveal" sections.
    *   Intersperse the content with at least two simple multiple-choice questions (using styled radio buttons) to check for understanding. Mark the correct answer.
    *   Highlight key terms using the \`<strong>\` tag.
    *   Use simple inline CSS for styling (e.g., padding, borders, colors).

3.  **Generate Flashcards:**
    *   Identify 8-12 of the most important key terms or concepts from the lesson.
    *   For each, create a flashcard object with a concise 'term' and a clear 'definition'.

4.  **Generate PowerPoint Outline:**
    *   Create a structured outline for a presentation with 5-7 slides.
    *   For each slide, provide a clear 'title' and a list of 3-5 concise 'bulletPoints'.

5.  **Generate Summary PDF Content:**
    *   Write a one-page summary of the entire lesson in Markdown format.
    *   It should include the main ideas, key definitions, and a concluding paragraph. This should be a perfect "cheat sheet" or study guide.

Return all four generated assets in the specified structured JSON format.
`,
});

export const generateGamifiedLesson = ai.defineFlow(
  {
    name: 'generateGamifiedLessonFlow',
    inputSchema: GamifiedLessonInputSchema,
    outputSchema: GamifiedLessonOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate gamified lesson materials.");
    }
    return output;
  }
);
