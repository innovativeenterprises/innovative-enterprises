

export interface SignedLease {
    id: string;
    contractType: 'Tenancy Agreement' | 'Sale Agreement';
    lessorName?: string;
    lesseeName?: string;
    propertyAddress: string;
    propertyType: string;
    price: number;
    pricePeriod?: string;
    startDate?: string;
    endDate?: string;
    additionalClauses?: string;
    status: 'Active' | 'Expired' | 'Terminated';
    content: string; // The full markdown content of the contract
}

export const initialLeases: SignedLease[] = [];
