

export interface SanadOfficeSettings {
    registrationFee: number;
    monthlyFee: number;
    yearlyFee: number;
    lifetimeFee: number;
    firstTimeDiscountPercentage: number; // Stored as 0.0 to 1.0
}

export interface LegalAgentPricing {
    b2cFee: number;
    b2bFee: number;
    b2gFee: number;
}

export interface WhatsAppSettings {
    businessAccountId: string;
    phoneNumberId: string;
    accessToken: string; // Note: For display only, actual value from env.
}

export interface AppSettings {
    translationAssignmentMode: 'direct' | 'tender' | 'builtin';
    sanadOffice: SanadOfficeSettings;
    legalAgentPricing: LegalAgentPricing;
    voiceInteractionEnabled: boolean;
    vat: {
        enabled: boolean;
        rate: number; // Stored as a decimal, e.g., 0.05 for 5%
    };
    headerImageUrl?: string;
    footerImageUrl?: string;
    servicesMenuColumns: 1 | 2 | 3 | 4;
    aiToolsMenuColumns: 1 | 2 | 3 | 4;
    whatsapp: WhatsAppSettings;
}

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
