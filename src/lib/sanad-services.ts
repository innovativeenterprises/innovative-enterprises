
import type { LucideIcon } from "lucide-react";
import { Building, User, FileText, Globe, Case, Landmark, Users, Briefcase } from "lucide-react";

export interface SanadService {
    name: string;
    icon: LucideIcon;
}

export const sanadServiceIcons: Record<string, LucideIcon> = {
    "Business & Corporate Services": Briefcase,
    "Individual & Family Services": User,
    "Ministry & Government Transactions": Landmark,
    "Other Services": FileText,
};


export const sanadServiceGroups: Record<string, string[]> = {
    "Business & Corporate Services": [
        "New Commercial Registration (CR)",
        "CR Renewal / Modification",
        "VAT Registration & Filing",
        "Company Liquidation",
        "Trademark Registration",
        "Investor Residency Program",
    ],
    "Individual & Family Services": [
        "Visa Application / Renewal (Family, Visit, Work)",
        "ID Card / Resident Card Renewal",
        "Driving License Renewal",
        "Utility Bill Payment (Water, Electricity)",
        "Property Rental Agreement Attestation",
    ],
    "Ministry & Government Transactions": [
        "Ministry of Labour (Work Permits, Sanctions)",
        "Ministry of Housing & Urban Planning",
        "Royal Oman Police (ROP) Services",
        "Ministry of Health (MOH) Clearances",
    ],
    "Other Services": [
        "Document Translation & Attestation",
        "PRO Services",
        "General Typing & Form Filling",
    ]
};
