
import { z } from 'zod';

export const WorkerSchema = z.object({
    id: z.string(),
    name: z.string(),
    nationality: z.string(),
    age: z.number(),
    skills: z.array(z.string()),
    experience: z.string(),
    availability: z.enum(['Available', 'Not Available']),
    rating: z.number(),
    photo: z.string().url(),
    agencyId: z.string(),
});
export type Worker = z.infer<typeof WorkerSchema>;
