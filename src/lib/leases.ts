

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
  lastPaymentDate?: string;
  nextDueDate?: string;
  paymentStatus?: 'Paid' | 'Upcoming' | 'Overdue';
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
    endDate: '2024-08-31',
    status: 'Active',
    content: 'This is the full markdown content of the tenancy agreement for Fatima Al-Hinai...',
    lastPaymentDate: new Date(new Date().setMonth(new Date().getMonth() -1)).toISOString(),
    nextDueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
    paymentStatus: 'Paid',
  },
  {
    id: 'lease_456',
    contractType: 'Tenancy Agreement',
    propertyAddress: 'Al Qurum Complex, Apt 305',
    propertyType: '2-Bedroom Apartment',
    lessorName: 'Muscat Properties LLC',
    lesseeName: 'John Smith',
    price: 450,
    pricePeriod: 'per month',
    startDate: '2024-01-15',
    endDate: '2025-01-14',
    status: 'Active',
    content: 'Standard tenancy agreement content for John Smith...',
    lastPaymentDate: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
    nextDueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    paymentStatus: 'Overdue',
  },
  {
    id: 'lease_789',
    contractType: 'Tenancy Agreement',
    propertyAddress: 'Wave Homes, Villa 8',
    propertyType: '4-Bedroom Villa',
    lessorName: 'Al Mouj Muscat',
    lesseeName: 'The Anderson Family',
    price: 1200,
    pricePeriod: 'per month',
    startDate: '2023-11-01',
    endDate: '2024-10-31',
    status: 'Active',
    content: 'Villa lease agreement content...',
    lastPaymentDate: new Date(new Date().setMonth(new Date().getMonth() -1)).toISOString(),
    nextDueDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(),
    paymentStatus: 'Upcoming',
  },
];
