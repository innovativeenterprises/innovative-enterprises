
'use server';

/**
 * @fileOverview An AI agent that transforms educational content into gamified materials.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const gamificationTypes = ['interactiveBookHtml', 'flashcards', 'powerpointOutline', 'summaryPdfContent'] as const;
export type GamificationType = (typeof gamificationTypes)[number];

const GamifiedLessonInputSchema = z.object({
  documentUri: z.string().url().describe("A data URI of the lesson document (PDF, TXT, etc.)."),
  topic: z.string().describe("The main topic of the lesson."),
  targetAudience: z.string().describe("The target audience, e.g., 'Grade 5 students' or 'University undergraduates'."),
  outputs: z.array(z.enum(gamificationTypes)).optional().describe("Specific outputs to generate. If empty, AI will decide."),
});

const GamifiedLessonOutputSchema = z.object({
  interactiveBookHtml: z.string().optional().describe("HTML content for an interactive, gamified version of the lesson."),
  flashcards: z.array(z.object({
    term: z.string().describe("A key term from the lesson."),
    definition: z.string().describe("A concise definition of the term."),
  })).optional().describe("A list of flashcards for key terms."),
  powerpointOutline: z.object({
    slides: z.array(z.object({
      title: z.string().describe("The title of the slide."),
      bulletPoints: z.array(z.string()).describe("A list of key bullet points for the slide."),
    })),
  }).optional().describe("A structured outline for a PowerPoint presentation."),
  summaryPdfContent: z.string().optional().describe("A concise summary of the lesson in Markdown format, suitable for a PDF study guide."),
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

{{#if outputs.length}}
2.  **Generate Requested Outputs:** Generate ONLY the following materials based on the user's selection: {{{json outputs}}}
    *   **If 'interactiveBookHtml' is requested:** Create an engaging HTML structure with clickable sections, multiple-choice questions, and highlighted terms. Use simple inline CSS.
    *   **If 'flashcards' is requested:** Identify 8-12 key terms and provide concise definitions.
    *   **If 'powerpointOutline' is requested:** Create a structured outline for a 5-7 slide presentation with titles and bullet points.
    *   **If 'summaryPdfContent' is requested:** Write a one-page summary in Markdown, perfect for a study guide.
{{else}}
2.  **AI Decides Outputs:** The user has not specified outputs. Analyze the content and generate the **two most appropriate** material types for this lesson. For example, a definition-heavy text is good for flashcards, while a narrative text is good for an interactive book.
{{/if}}

Return all generated assets in the specified structured JSON format. Only include fields for the assets you were instructed to generate.
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
