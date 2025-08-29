


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
}

export const initialSettings: AppSettings = {
    translationAssignmentMode: 'direct',
    sanadOffice: {
        registrationFee: 2.5,
        monthlyFee: 1.6,
        yearlyFee: 16,
        lifetimeFee: 28,
        firstTimeDiscountPercentage: 0.60,
    },
    legalAgentPricing: {
        b2cFee: 0.4,
        b2bFee: 2.5,
        b2gFee: 6.5,
    },
    voiceInteractionEnabled: true,
    vat: {
        enabled: true,
        rate: 0.05, // 5%
    },
    headerImageUrl: "https://storage.googleapis.com/stella-images/studio-app-live/20240801-140026-646-logo.png",
    footerImageUrl: "",
};
