

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
}

export const initialSettings: AppSettings = {
    translationAssignmentMode: 'direct',
    sanadOffice: {
        registrationFee: 25,
        monthlyFee: 16,
        yearlyFee: 160,
        lifetimeFee: 280,
        firstTimeDiscountPercentage: 0.60,
    },
    legalAgentPricing: {
        b2cFee: 4,
        b2bFee: 25,
        b2gFee: 65,
    },
    voiceInteractionEnabled: true,
    vat: {
        enabled: true,
        rate: 0.05, // 5%
    },
};
