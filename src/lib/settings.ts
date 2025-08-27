

export interface SanadOfficeSettings {
    registrationFee: number;
    monthlyFee: number;
    yearlyFee: number;
    lifetimeFee: number;
    firstTimeDiscountPercentage: number; // Stored as 0.0 to 1.0
}

export interface AppSettings {
    translationAssignmentMode: 'direct' | 'tender' | 'builtin';
    sanadOffice: SanadOfficeSettings;
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
    voiceInteractionEnabled: true,
    vat: {
        enabled: true,
        rate: 0.05, // 5%
    },
};
