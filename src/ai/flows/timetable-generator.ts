
'use server';

/**
 * @fileOverview An AI agent that generates a class timetable based on constraints.
 */

import { ai } from '@/ai/genkit';
import {
    TimetableGeneratorInputSchema,
    TimetableGeneratorInput,
    TimetableGeneratorOutputSchema,
    TimetableGeneratorOutput,
} from './timetable-generator.schema';


export async function generateTimetable(input: TimetableGeneratorInput): Promise<TimetableGeneratorOutput> {
  return timetableGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'timetableGeneratorPrompt',
  input: { schema: TimetableGeneratorInputSchema },
  output: { schema: TimetableGeneratorOutputSchema },
  prompt: `You are an expert AI-powered scheduler for educational institutions. Your task is to generate a valid, conflict-free weekly class schedule based on a given set of constraints.

**Constraints:**

*   **Days:** {{{json days}}}
*   **Time Slots per Day:** {{{json timeSlots}}}
*   **Available Classrooms:** {{{json classrooms}}}
*   **Subjects & Teachers:** {{{json subjects}}}

**Rules & Objectives:**
1.  **No Teacher Conflicts:** A teacher cannot be in two different classrooms at the same time.
2.  **No Classroom Conflicts:** A classroom cannot be used for two different subjects at the same time.
3.  **Fulfill Required Slots:** Each subject must be scheduled for its exact number of 'requiredSlots' per week.
4.  **Optimal Distribution:** Spread the classes for each subject as evenly as possible throughout the week. Avoid scheduling the same subject back-to-back on the same day if possible.

**Output Generation:**
*   **Schedule:** Generate a JSON object representing the schedule. The top-level keys should be the days of the week. Each day should be an object where keys are the time slots. The value for each slot should be an object containing the \`subjectId\`, \`classroomId\`, and \`teacher\`.
*   **Diagnostics:**
    *   Set \`isPossible\` to \`true\` if a valid schedule that meets all constraints can be created. If not, set it to \`false\`.
    *   Provide a \`message\` summarizing the result. If impossible, explain why (e.g., "Not enough time slots available to schedule all required classes.").
    *   If any subjects could not be fully scheduled, list their names in the \`unassignedSubjects\` array.

Create the most optimal and balanced schedule possible.
`,
});

const timetableGeneratorFlow = ai.defineFlow(
  {
    name: 'timetableGeneratorFlow',
    inputSchema: TimetableGeneratorInputSchema,
    outputSchema: TimetableGeneratorOutputSchema,
  },
  async (input) => {
    // Basic validation to prevent impossible scenarios before calling the AI
    const totalRequiredSlots = input.subjects.reduce((sum, s) => sum + s.requiredSlots, 0);
    const totalAvailableSlots = input.classrooms.length * input.days.length * input.timeSlots.length;

    if (totalRequiredSlots > totalAvailableSlots) {
        return {
            schedule: {},
            diagnostics: {
                isPossible: false,
                message: `Scheduling is impossible. There are ${totalRequiredSlots} required class slots but only ${totalAvailableSlots} available slots in the schedule. Please add more classrooms or time slots.`,
                unassignedSubjects: input.subjects.map(s => s.name),
            }
        };
    }
    
    const { output } = await prompt(input);
    return output!;
  }
);
