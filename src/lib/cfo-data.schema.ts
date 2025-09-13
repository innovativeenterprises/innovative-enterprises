
import { z } from 'zod';
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";

export const KpiDataSchema = z.object({
    title: z.string(),
    value: z.string(),
    change: z.string(),
    // icon: z.any(), // Cannot serialize icon components
    href: z.string(),
});
