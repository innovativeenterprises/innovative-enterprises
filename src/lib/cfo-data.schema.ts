
import { z } from 'zod';

export const KpiDataSchema = z.object({
    title: z.string(),
    value: z.string(),
    change: z.string(),
    icon: z.string(), // Changed from z.any() to z.string()
    href: z.string(),
});

export const TransactionSchema = z.object({
    client: z.string(),
    type: z.string(),
    status: z.enum(['Paid', 'Pending', 'Overdue']),
    total: z.number(),
});

export const UpcomingPaymentSchema = z.object({
    source: z.string(),
    dueDate: z.string(),
    amount: z.number(),
});

export const CashFlowSchema = z.object({
    month: z.string(),
    income: z.number(),
    expenses: z.number(),
});

export const CfoDataSchema = z.object({
    kpiData: z.array(KpiDataSchema),
    transactionData: z.array(TransactionSchema),
    upcomingPayments: z.array(UpcomingPaymentSchema),
    vatPayment: z.object({
        amount: z.number(),
        dueDate: z.string(),
    }),
    cashFlowData: z.array(CashFlowSchema),
});

export type CfoData = z.infer<typeof CfoDataSchema>;
