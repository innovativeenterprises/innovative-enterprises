

import { z } from 'zod';
import type { TimetableGeneratorInput, TimetableGeneratorOutput } from './timetable-generator.schema';

// Re-exporting from timetable-generator as the schema is identical for this use case.
export type { TimetableGeneratorInput, TimetableGeneratorOutput };
export { TimetableGeneratorInputSchema, TimetableGeneratorOutputSchema } from './timetable-generator.schema';
