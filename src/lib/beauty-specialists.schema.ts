
import { z } from 'zod';

export const BeautySpecialistSchema = z.object({
    id: z.string(),
    agencyId: z.string(),
    name: z.string(),
    specialty: z.string(),
    photo: z.string().url(),
});
export type BeautySpecialist = z.infer<typeof BeautySpecialistSchema>;
