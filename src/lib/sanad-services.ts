
import type { LucideIcon } from "lucide-react";
import { Building, User, FileText, Globe, Case, Landmark, Users, Briefcase, Car, Shield, HeartPulse, HandCoins } from "lucide-react";

export interface SanadService {
    name: string;
    icon: LucideIcon;
}

export const sanadServiceIcons: Record<string, LucideIcon> = {
    "Ministry of Commerce, Industry & Investment Promotion (MOCIIP)": Briefcase,
    "Ministry of Labour": Users,
    "Royal Oman Police (ROP)": Shield,
    "Ministry of Housing and Urban Planning": Building,
    "Ministry of Health (MOH)": HeartPulse,
    "Ministry of Transport, Communications and IT (MTCIT)": Car,
    "Ministry of Foreign Affairs": Globe,
    "Other Services": FileText,
};


export const sanadServiceGroups: Record<string, string[]> = {
    "Ministry of Commerce, Industry & Investment Promotion (MOCIIP)": [
        "New Commercial Registration (CR)",
        "CR Renewal",
        "Add/Remove Commercial Activity",
        "Update Company Data (Address, Partners)",
        "Company Liquidation / Deregistration",
        "Trademark Registration",
        "Agency/Franchise Agreement Registration",
        "Import/Export License Application",
    ],
    "Ministry of Labour": [
        "New Work Permit (Expat)",
        "Work Permit Renewal (Expat)",
        "Labour Clearance for New Employees",
        "Update Employee Records",
        "Registration of Employment Contract",
        "Sponsorship Transfer",
        "Report Absconding Employee",
        "Omanisation Plan Submission",
    ],
    "Royal Oman Police (ROP)": [
        "New Visa Application (Work, Family, Visit)",
        "Visa Renewal",
        "Visa Status Tracking",
        "Resident Card (ID) Renewal",
        "New Driving License Application",
        "Driving License Renewal",
        "Vehicle Registration (Mulkiya) Renewal",
        "Traffic Fine Payment",
    ],
    "Ministry of Housing and Urban Planning": [
        "Rental Agreement Attestation (E-jar)",
        "Title Deed (Mulkiya) Application/Renewal",
        "Request for Land Krori (Sketch)",
        "Property Ownership Transfer",
    ],
    "Ministry of Health (MOH)": [
        "Medical Examination for Residency",
        "Food & Water Laboratory Testing",
        "License for Medical/Pharmaceutical Practice",
        "Import Permit for Medicines & Medical Devices",
    ],
    "Ministry of Transport, Communications and IT (MTCIT)": [
        "Commercial Vehicle Operating License",
        "Permit for Road Works",
        "Registration of Maritime Vessels",
    ],
    "Ministry of Foreign Affairs": [
        "Document Attestation (Marriage/Birth Cert., Degrees)",
    ],
    "Other Services": [
        "Tax Authority (VAT Registration, Filing)",
        "Utility Bill Payment (Water, Electricity, Telecom)",
        "PRO Services for Document Collection/Submission",
        "General Typing & Form Filling",
    ]
};
