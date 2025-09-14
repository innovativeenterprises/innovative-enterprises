
import { z } from 'zod';
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";

export const KpiDataSchema = z.object({
    title: z.string(),
    value: z.string(),
    change: z.string(),
    // icon component cannot be serialized, so we can omit it or use a string identifier
    href: z.string(),
});
