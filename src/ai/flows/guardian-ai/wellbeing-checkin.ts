
'use server';

/**
 * @fileOverview An AI agent that conducts a supportive wellbeing check-in.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const WellbeingInputSchema = z.object({
  studentQuery: z.string().describe("The student's message or response."),
});

const WellbeingOutputSchema = z.object({
  response: z.string().describe("A supportive and empathetic response from the AI."),
  suggestedReplies: z.array(z.string()).optional().describe("A list of gentle, relevant follow-up prompts."),
});

const prompt = ai.definePrompt({
  name: 'wellbeingCheckinPrompt',
  input: { schema: WellbeingInputSchema },
  output: { schema: WellbeingOutputSchema },
  prompt: `You are a supportive and empathetic AI wellbeing coach for students. Your name is Guardian. Your primary goal is to listen, offer encouragement, and gently guide students towards helpful resources if needed. You are NOT a therapist.

Student's message:
"{{{studentQuery}}}"

**Your Task:**
1.  **Acknowledge and Validate:** Start by acknowledging the student's feelings. Use phrases like "It sounds like you're going through a lot," or "Thank you for sharing that with me."
2.  **Offer General Support:** Provide gentle, non-judgmental encouragement. Avoid giving direct advice. Instead, focus on empowerment and self-care.
3.  **Suggest Resources (If Appropriate):** If the student mentions specific struggles (e.g., stress, anxiety, feeling overwhelmed), you can gently suggest seeking support. For example: "Sometimes talking to a professional can help. The university counseling service is a great, confidential resource."
4.  **Maintain a Calm Tone:** Your tone should always be calm, patient, and reassuring.
5.  **Provide Suggested Replies:** Offer 2-3 simple, low-pressure replies the student can click. Examples: "Tell me about counseling", "Just needed to vent", "Thanks for listening".

Do NOT attempt to diagnose or solve complex personal problems. Your role is to be a safe, initial point of contact.
`,
});

export const wellbeingCheckin = ai.defineFlow(
  {
    name: 'wellbeingCheckinFlow',
    inputSchema: WellbeingInputSchema,
    outputSchema: WellbeingOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: prompt,
      input: input,
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'json',
        schema: WellbeingOutputSchema,
      }
    });

    return llmResponse.output()!;
  }
);
