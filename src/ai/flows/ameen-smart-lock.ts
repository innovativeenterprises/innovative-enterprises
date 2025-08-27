
'use server';

/**
 * @fileOverview An AI agent that simulates controlling a smart lock.
 *
 * This flow would interact with IoT hardware in a real-world application.
 * For this prototype, it simulates the lock/unlock actions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SmartLockInputSchema = z.object({
  action: z.enum(['lock', 'unlock', 'status']),
  deviceId: z.string().describe("The unique ID of the smart lock device."),
});

const SmartLockOutputSchema = z.object({
  status: z.enum(['locked', 'unlocked', 'jammed', 'unknown']),
  message: z.string().describe("A confirmation message for the user."),
});

// A simple in-memory representation of our smart lock's state.
// In a real app, this would be a database or a direct API call to the device.
let lockState: 'locked' | 'unlocked' = 'locked';

const smartLockTool = ai.defineTool(
    {
        name: 'smartLockTool',
        description: 'Controls a physical smart lock. Can lock, unlock, or check the status of the device.',
        inputSchema: SmartLockInputSchema,
        outputSchema: SmartLockOutputSchema,
    },
    async ({ action, deviceId }) => {
        console.log(`Performing action '${action}' on device '${deviceId}'`);
        
        // Simulate hardware interaction
        await new Promise(resolve => setTimeout(resolve, 500));

        if (action === 'lock') {
            lockState = 'locked';
            return { status: 'locked', message: `Successfully locked device ${deviceId}.` };
        }
        if (action === 'unlock') {
            lockState = 'unlocked';
            return { status: 'unlocked', message: `Successfully unlocked device ${deviceId}.` };
        }
        // action === 'status'
        return { status: lockState, message: `Device ${deviceId} is currently ${lockState}.` };
    }
);


export const controlSmartLock = ai.defineFlow(
  {
    name: 'controlSmartLock',
    inputSchema: SmartLockInputSchema,
    outputSchema: SmartLockOutputSchema,
  },
  async (input) => {
    // This flow directly calls the tool without needing an LLM to decide.
    // This is useful for direct command-and-control scenarios.
    const result = await smartLockTool(input);
    return result;
  }
);
