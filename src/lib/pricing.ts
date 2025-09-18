
import type { Pricing } from './pricing.schema';

export const initialPricing: Pricing[] = [
    { id: 'legal_cert', type: 'Certificates (Birth, Marriage, Death, etc.)', group: 'Legal & Official Documents', price: 5.00 },
    { id: 'legal_court', type: 'Court Documents, Power of Attorney', group: 'Legal & Official Documents', price: 8.50 },
    { id: 'legal_contract', type: 'Complex Legal Contracts, Immigration Docs', group: 'Legal & Official Documents', price: 12.00 },
    { id: 'medical_basic', type: 'Prescriptions, Basic Reports', group: 'Medical & Healthcare Documents', price: 4.00 },
    { id: 'medical_records', type: 'Patient Records, Discharge Summaries', group: 'Medical & Healthcare Documents', price: 7.50 },
    { id: 'medical_advanced', type: 'Clinical Trials, Research Papers', group: 'Medical & Healthcare Documents', price: 15.00 },
    { id: 'business_simple', type: 'Company Licenses, Simple Agreements', group: 'Business & Commercial Documents', price: 6.00 },
    { id: 'business_financial', type: 'Financial Statements, Policies, MOUs', group: 'Business & Commercial Documents', price: 9.00 },
    { id: 'business_complex', type: 'Import/Export, Detailed Trading Contracts', group: 'Business & Commercial Documents', price: 14.00 },
];
