
'use server';

/**
 * @fileOverview An AI agent that generates a work schedule based on constraints.
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
  prompt: `You are an expert AI-powered scheduler for construction and logistics projects. Your task is to generate a valid, conflict-free weekly work schedule based on a given set of constraints.

**Constraints:**

*   **Workings Days:** {{{json days}}}
*   **Time Slots per Day:** {{{json timeSlots}}}
*   **Available Job Sites:** {{{json classrooms}}}
*   **Tasks & Assigned Workers/Teams:** {{{json subjects}}}

**Rules & Objectives:**
1.  **No Worker Conflicts:** A worker/team ('teacher') cannot be in two different job sites ('classrooms') at the same time.
2.  **No Site Conflicts:** A job site ('classroom') cannot be occupied by two different teams for different tasks at the same time.
3.  **Fulfill Required Slots:** Each task ('subject') must be scheduled for its exact number of 'requiredSlots' per week.
4.  **Optimal Distribution:** Spread the work for each task as evenly as possible throughout the week. Avoid scheduling the same task back-to-back on the same day if possible.

**Output Generation:**
*   **Schedule:** Generate a flat JSON array of schedule entry objects. Each object in the array represents one scheduled block and must contain the \`day\`, \`timeSlot\`, \`subjectId\`, \`classroomId\`, and \`teacher\`.
*   **Diagnostics:**
    *   Set \`isPossible\` to \`true\` if a valid schedule that meets all constraints can be created. If not, set it to \`false\`.
    *   Provide a \`message\` summarizing the result. If impossible, explain why (e.g., "Not enough time slots available to schedule all required tasks.").
    *   If any tasks ('subjects') could not be fully scheduled, list their names in the \`unassignedSubjects\` array.

Create the most optimal and balanced work schedule possible.
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
            schedule: [],
            diagnostics: {
                isPossible: false,
                message: `Scheduling is impossible. There are ${totalRequiredSlots} required work slots but only ${totalAvailableSlots} available slots in the schedule. Please add more job sites or time slots.`,
                unassignedSubjects: input.subjects.map(s => s.name),
            }
        };
    }
    
    const { output } = await prompt(input);
    return output!;
  }
);
