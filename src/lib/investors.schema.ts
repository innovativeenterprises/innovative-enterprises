
import { z } from 'zod';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';

export const InvestorSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['Investor', 'Funder']),
  subType: z.enum(['Personal/Private', 'Angel', 'Institute/Government', 'VC Fund']),
  profile: z.string().optional(),
  focusArea: z.string().optional(),
  country: z.string().optional(),
  investmentValue: z.number().optional(),
  sharePercentage: z.number().optional(),
  documents: z.object({
    nda: z.string().optional(),
    safe: z.string().optional(),
    convertibleNote: z.string().optional(),
  }).optional(),
});
export type Investor = z.infer<typeof InvestorSchema>;

export const CfoDataSchema = z.object({
  kpiData: z.array(z.object({
    title: z.string(),
    value: z.string(),
    change: z.string(),
    icon: z.any(),
    href: z.string(),
  })),
  transactionData: z.array(z.object({
    client: z.string(),
    type: z.string(),
    status: z.string(),
    total: z.number(),
  })),
  upcomingPayments: z.array(z.object({
    source: z.string(),
    dueDate: z.string(),
    amount: z.number(),
  })),
  vatPayment: z.object({
    amount: z.number(),
    dueDate: z.string(),
  }),
  cashFlowData: z.array(z.object({
    month: z.string(),
    income: z.number(),
    expenses: z.number(),
  })),
});
