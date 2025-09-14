
import type { LucideIcon } from "lucide-react";
import { ShieldCheck, FileText, Banknote } from "lucide-react";

export interface Pricing {
    id: string;
    group: string;
    type: string;
    price: number;
}

export interface PricingGroup {
    group: string;
    icon: LucideIcon;
    items: { [key: string]: number };
}

export const initialPricing: Pricing[] = [
    // Legal & Official
    { id: 'price_cert_legal', group: "Legal & Official Documents", type: 'Certificates (Birth, Marriage, Death, etc.)', price: 4.0 },
    { id: 'price_court', group: "Legal & Official Documents", type: 'Court Documents, Power of Attorney, Notarized Docs', price: 6.0 },
    { id: 'price_contracts_legal', group: "Legal & Official Documents", type: 'Complex Legal Contracts, Immigration Docs', price: 8.0 },
    // Medical & Healthcare
    { id: 'price_prescriptions', group: "Medical & Healthcare Documents", type: 'Prescriptions, Test Results, Basic Reports', price: 4.0 },
    { id: 'price_records', group: "Medical & Healthcare Documents", type: 'Patient Records, Discharge Summaries', price: 6.0 },
    { id: 'price_trials', group: "Medical & Healthcare Documents", type: 'Clinical Trials, Research, Device Instructions', price: 8.0 },
    // Business & Commercial
    { id: 'price_licenses', group: "Business & Commercial Documents", type: 'Company Licenses, Simple Agreements', price: 5.0 },
    { id: 'price_financials', group: "Business & Commercial Documents", type: 'Financial Statements, Policies, MOUs', price: 7.0 },
    { id: 'price_import_export', group: "Business & Commercial Documents", type: 'Import/Export, Detailed Trading Contracts', price: 8.0 },
    // Educational & Academic
    { id: 'price_cert_edu', group: "Educational & Academic Documents", type: 'Certificates, Diplomas, Transcripts', price: 4.0 },
    { id: 'price_recommendation', group: "Educational & Academic Documents", type: 'Recommendation Letters, Course Material', price: 5.0 },
    { id: 'price_thesis', group: "Educational & Academic Documents", type: 'Thesis, Dissertations, Research Papers', price: 7.0 },
    // Technical & Industrial
    { id: 'price_manuals', group: "Technical & Industrial Documents", type: 'User Manuals, Product Guides', price: 6.0 },
    { id: 'price_patents', group: "Technical & Industrial Documents", type: 'Patents, Engineering Specs, Safety Data Sheets', price: 8.0 },
    // Media & Marketing
    { id: 'price_flyers', group: "Media & Marketing Documents", type: 'Flyers, Brochures, Simple Ads', price: 4.0 },
    { id: 'price_websites', group: "Media & Marketing Documents", type: 'Websites, Presentations, Proposals', price: 6.0 },
    { id: 'price_branding', group: "Media & Marketing Documents", type: 'Branding, Creative Copy with Localization', price: 7.0 },
    // Financial & Trade
    { id: 'price_bank', group: "Financial & Trade Documents", type: 'Bank Statements, Loan Forms, Insurance Policies', price: 5.0 },
    { id: 'price_trade_contracts', group: "Financial & Trade Documents", type: 'Trading Contracts, Customs Declarations, Tax Reports', price: 7.0 },
    { id: 'price_other', group: "Other", type: 'Other', price: 5.0 },
];
