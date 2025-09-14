
export interface RentalAgency {
  id: string;
  name: string;
  location: string;
  logoUrl: string;
}

export const initialRentalAgencies: RentalAgency[] = [
  {
    id: 'agency_1',
    name: 'Oman Rent-a-Car',
    location: 'Muscat',
    logoUrl: 'https://placehold.co/100x100/3498db/ffffff/png?text=ORC',
  },
  {
    id: 'agency_2',
    name: 'Salalah Car Rentals',
    location: 'Salalah',
    logoUrl: 'https://placehold.co/100x100/2ecc71/ffffff/png?text=SCR',
  },
];
