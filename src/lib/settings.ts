
import { z } from 'zod';

export const SanadOfficeSettingsSchema = z.object({
    registrationFee: z.coerce.number(),
    monthlyFee: z.coerce.number(),
    yearlyFee: z.coerce.number(),
    lifetimeFee: z.coerce.number(),
    firstTimeDiscountPercentage: z.coerce.number().min(0).max(1),
});

export const LegalAgentPricingSchema = z.object({
    b2cFee: z.coerce.number(),
    b2bFee: z.coerce.number(),
    b2gFee: z.coerce.number(),
});

export const WhatsAppSettingsSchema = z.object({
    businessAccountId: z.string(),
    phoneNumberId: z.string(),
    accessToken: z.string(),
});

export const AppSettingsSchema = z.object({
    translationAssignmentMode: z.enum(['direct', 'tender', 'builtin']),
    sanadOffice: SanadOfficeSettingsSchema,
    legalAgentPricing: LegalAgentPricingSchema,
    voiceInteractionEnabled: z.boolean(),
    chatWidgetEnabled: z.boolean(),
    vat: z.object({
        enabled: z.boolean(),
        rate: z.coerce.number().min(0).max(1),
    }),
    headerImageUrl: z.string().url().optional().or(z.literal('')),
    footerImageUrl: z.string().url().optional().or(z.literal('')),
    servicesMenuColumns: z.coerce.number().min(1).max(4).int() as z.ZodType<1 | 2 | 3 | 4>,
    aiToolsMenuColumns: z.coerce.number().min(1).max(4).int() as z.ZodType<1 | 2 | 3 | 4>,
    whatsapp: WhatsAppSettingsSchema,
});

export type AppSettings = z.infer<typeof AppSettingsSchema>;

export const initialSettings: AppSettings = {
    translationAssignmentMode: 'direct',
    sanadOffice: {
        registrationFee: 25.0,
        monthlyFee: 16.0,
        yearlyFee: 160.0,
        lifetimeFee: 280.0,
        firstTimeDiscountPercentage: 0.60,
    },
    legalAgentPricing: {
        b2cFee: 4.0,
        b2bFee: 25.0,
        b2gFee: 65.0,
    },
    voiceInteractionEnabled: true,
    chatWidgetEnabled: true,
    vat: {
        enabled: true,
        rate: 0.05, // 5%
    },
    headerImageUrl: "https://storage.googleapis.com/stella-images/studio-app-live/20240801-140026-646-logo.png",
    footerImageUrl: "",
    servicesMenuColumns: 3,
    aiToolsMenuColumns: 4,
    whatsapp: {
        businessAccountId: 'YOUR_WHATSAPP_BUSINESS_ACCOUNT_ID',
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || 'YOUR_PHONE_NUMBER_ID',
        accessToken: 'STORED_SECURELY_IN_ENV',
    }
};
