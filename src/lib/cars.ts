
import type { Car } from './cars.schema';

export const initialCars: Car[] = [
  { id: 'car_01', make: 'Toyota', model: 'Land Cruiser', year: 2023, type: 'SUV', rentalAgencyId: 'agency_1', pricePerDay: 45.0, location: 'Muscat Airport', availability: 'Available', imageUrl: 'https://images.unsplash.com/photo-1617361599347-a8b2b0751333?q=80&w=600&auto=format&fit=crop', features: ['7-Seater', '4x4', 'GPS'] },
  { id: 'car_02', make: 'Hyundai', model: 'Elantra', year: 2024, type: 'Sedan', rentalAgencyId: 'agency_1', pricePerDay: 15.0, location: 'Salalah Downtown', availability: 'Rented', imageUrl: 'https://images.unsplash.com/photo-1616422285832-b75b1527a275?q=80&w=600&auto=format&fit=crop', features: ['Bluetooth', 'Cruise Control'] },
];
