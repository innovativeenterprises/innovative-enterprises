
export interface SignedLease {
    id: string;
    contractType: 'Tenancy Agreement' | 'Sale Agreement';
    lessorName?: string;
    lesseeName?: string;
    propertyAddress: string;
    propertyType: string;
    price: number;
    pricePeriod?: string;
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
    status: 'Active' | 'Expired' | 'Terminated';
    content: string; // The full markdown content of the contract
}

export const initialLeases: SignedLease[] = [
    {
        id: "lease_1722883391993",
        contractType: "Tenancy Agreement",
        lessorName: "Innovative Properties LLC",
        lesseeName: "Fatima Al-Habsi",
        propertyAddress: "Campus Residence Hall A, Room 201",
        propertyType: "Single Student Dormitory",
        price: 150,
        pricePeriod: "per month",
        startDate: "2024-09-01T00:00:00.000Z",
        endDate: "2025-06-30T00:00:00.000Z",
        status: "Active",
        content: "Draft tenancy agreement content..."
    }
];

