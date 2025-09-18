
export interface SignedLease {
  id: string;
  contractType: 'Tenancy Agreement' | 'Sale Agreement';
  propertyAddress: string;
  propertyType: string;
  lessorName: string;
  lesseeName: string;
  price: number;
  pricePeriod?: 'per month' | 'per year';
  startDate?: string;
  endDate?: string;
  status: 'Active' | 'Expired' | 'Terminated';
  content: string; // The full markdown content of the signed agreement
}

export const initialLeases: SignedLease[] = [
  {
    id: 'lease_123',
    contractType: 'Tenancy Agreement',
    propertyAddress: 'SQU Student Housing, Block A, Room 201',
    propertyType: 'Single Student Dormitory',
    lessorName: 'Sultan Qaboos University',
    lesseeName: 'Fatima Al-Hinai',
    price: 120,
    pricePeriod: 'per month',
    startDate: '2023-09-01',
    endDate: '2024-06-30',
    status: 'Active',
    content: 'This is the full markdown content of the tenancy agreement for Fatima Al-Hinai...'
  },
];
