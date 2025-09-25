
'use server';

/**
 * @fileOverview A specialized AI agent for generating logistics and delivery schedules.
 */

import { ai } from '@/ai/genkit';
import {
    TimetableGeneratorInputSchema,
    TimetableGeneratorInput,
    TimetableGeneratorOutputSchema,
    TimetableGeneratorOutput,
} from './timetable-generator.schema';


export async function generateLogisticsSchedule(input: TimetableGeneratorInput): Promise<TimetableGeneratorOutput> {
  return logisticsSchedulerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'logisticsSchedulerPrompt',
  input: { schema: TimetableGeneratorInputSchema },
  output: { schema: TimetableGeneratorOutputSchema },
  prompt: `You are an expert AI-powered logistics coordinator for a distribution company. Your task is to generate a valid, conflict-free weekly delivery schedule based on a given set of constraints.

**Your Goal:** Create the most optimal and balanced schedule to maximize vehicle utilization and ensure timely deliveries.

**Constraints:**

*   **Workings Days:** {{{json days}}}
*   **Time Slots per Day:** {{{json timeSlots}}}
*   **Available Destinations/Hubs (Docks):** {{{json classrooms}}}
*   **Delivery Tasks & Assigned Vehicles:** {{{json subjects}}}

**Rules & Objectives:**
1.  **No Vehicle Conflicts:** A vehicle ('teacher') cannot be assigned to two different destinations ('classrooms') at the same time.
2.  **No Destination Conflicts:** A destination's loading dock ('classroom') cannot be occupied by two different vehicles at the same time.
3.  **Fulfill Required Trips:** Each task ('subject') must be scheduled for its exact number of 'requiredSlots' (trips) per week.
4.  **Optimal Distribution:** Spread the trips for each route as evenly as possible throughout the week. Avoid scheduling the same truck for back-to-back long-distance trips if possible to allow for turnaround time.

**Output Generation:**
*   **Schedule:** Generate a flat JSON array of schedule entry objects. Each object represents one scheduled delivery slot and MUST contain the \`day\`, \`timeSlot\`, \`subjectId\` (the task/route ID), \`classroomId\` (the destination ID), and \`teacher\` (the vehicle name).
*   **Diagnostics:**
    *   Set \`isPossible\` to \`true\` if a valid schedule that meets all constraints can be created. If not, set it to \`false\`.
    *   Provide a \`message\` summarizing the result. If impossible, explain the primary conflict (e.g., "Scheduling is impossible. Not enough available time slots at the Muscat Hub to handle all required local deliveries.").
    *   If any delivery tasks ('subjects') could not be fully scheduled, list their names in the \`unassignedSubjects\` array.
`,
});

const logisticsSchedulerFlow = ai.defineFlow(
  {
    name: 'logisticsSchedulerFlow',
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
                message: `Scheduling is impossible. There are ${totalRequiredSlots} required delivery slots but only ${totalAvailableSlots} available slots across all destinations. Please add more destinations or reduce the number of trips.`,
                unassignedSubjects: input.subjects.map(s => s.name),
            }
        };
    }
    
    const llmResponse = await ai.generate({
      prompt: prompt,
      input: input,
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'json',
        schema: TimetableGeneratorOutputSchema,
      }
    });

    return llmResponse.output()!;
  }
);
