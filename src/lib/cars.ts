
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  type: 'Sedan' | 'SUV' | 'Coupe' | 'Truck';
  rentalAgencyId: string;
  pricePerDay: number;
  location: string;
  availability: 'Available' | 'Rented';
  imageUrl: string;
  features: string[];
}

export const initialCars: Car[] = [
  {
    id: 'car_001',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    type: 'Sedan',
    rentalAgencyId: 'agency_1',
    pricePerDay: 25,
    location: 'Muscat International Airport',
    availability: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1553551528-6a5c1f0b433e?q=80&w=1920&auto=format&fit=crop',
    features: ['Automatic', 'Air Conditioning', 'Bluetooth'],
  },
  {
    id: 'car_002',
    make: 'Nissan',
    model: 'Patrol',
    year: 2024,
    type: 'SUV',
    rentalAgencyId: 'agency_1',
    pricePerDay: 60,
    location: 'Muscat International Airport',
    availability: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1617545328585-6494b7c173d8?q=80&w=1920&auto=format&fit=crop',
    features: ['4x4', '7-Seater', 'Sunroof', 'Advanced GPS'],
  },
  {
    id: 'car_003',
    make: 'Hyundai',
    model: 'Elantra',
    year: 2023,
    type: 'Sedan',
    rentalAgencyId: 'agency_2',
    pricePerDay: 22,
    location: 'Salalah Airport',
    availability: 'Rented',
    imageUrl: 'https://images.unsplash.com/photo-1621360042188-75ab6e831447?q=80&w=1920&auto=format&fit=crop',
    features: ['Automatic', 'Cruise Control', 'Rear Camera'],
  },
  {
    id: 'car_004',
    make: 'Ford',
    model: 'Mustang',
    year: 2024,
    type: 'Coupe',
    rentalAgencyId: 'agency_2',
    pricePerDay: 80,
    location: 'Muscat Downtown',
    availability: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1920&auto=format&fit=crop',
    features: ['V8 Engine', 'Convertible', 'Premium Sound System'],
  },
];
