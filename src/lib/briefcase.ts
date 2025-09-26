

import type { CrAnalysisOutput } from "@/ai/flows/cr-analysis.schema";
import type { IdentityAnalysisOutput } from "@/ai/flows/identity-analysis.schema";
import type { BoQItem } from "@/ai/flows/boq-generator.schema";

export interface Agreement {
    ndaContent: string;
    serviceAgreementContent: string;
}

export interface ServiceRegistration {
    category: string;
    priceListUrl?: string;
    priceListFilename?: string;
}

export interface UserDocument {
    id: string;
    name: string;
    fileType: string;
    dataUri: string;
    uploadedAt: string;
    analysis?: CrAnalysisOutput | IdentityAnalysisOutput | null;
}

export interface SavedBoQ {
    id: string;
    name: string;
    date: string;
    items: BoQItem[];
}

export interface BriefcaseData {
    recordNumber: string;
    applicantName: string;
    agreements: Agreement;
    date: string;
    registrations: ServiceRegistration[];
    userDocuments: UserDocument[];
    savedBoqs: SavedBoQ[];
}


export const initialBriefcase: BriefcaseData = {
    recordNumber: `USER-GUEST`,
    applicantName: "Guest User",
    agreements: {
        ndaContent: "No Non-Disclosure Agreement found. Please complete the partner application to generate one.",
        serviceAgreementContent: "No Service Agreement found. Please complete the partner application to generate one.",
    },
    date: new Date().toISOString(),
    registrations: [],
    userDocuments: [],
    savedBoqs: [],
};

