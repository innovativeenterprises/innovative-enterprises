
import { z } from 'zod';

export const SmartLockInputSchema = z.object({
  action: z.enum(['lock', 'unlock', 'status']),
  deviceId: z.string().describe("The unique ID of the smart lock device."),
});

export const SmartLockOutputSchema = z.object({
  status: z.enum(['locked', 'unlocked', 'jammed', 'unknown']),
  message: z.string().describe("A confirmation message for the user."),
});
