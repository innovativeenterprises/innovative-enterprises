
export interface Property {
  id: string;
  title: string;
  listingType: 'For Sale' | 'For Rent';
  propertyType: 'Villa' | 'Apartment' | 'Townhouse';
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqM: number;
  description: string;
  imageUrl: string;
  status: 'Available' | 'Sold' | 'Rented';
  buildingAge: string;
}

export const initialProperties: Property[] = [
  {
    id: 'prop_1',
    title: 'Modern 4-Bedroom Villa with Pool',
    listingType: 'For Sale',
    propertyType: 'Villa',
    location: 'Al Mouj, Muscat',
    price: 350000,
    bedrooms: 4,
    bathrooms: 5,
    areaSqM: 400,
    description: 'A stunning, brand new villa in the heart of Al Mouj. Features a private swimming pool, landscaped garden, and high-end finishes throughout. Perfect for families looking for luxury and comfort.',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1920&auto=format&fit=crop',
    status: 'Available',
    buildingAge: '1 year',
  },
  {
    id: 'prop_2',
    title: 'Spacious 2-Bedroom Apartment',
    listingType: 'For Rent',
    propertyType: 'Apartment',
    location: 'Qurum, Muscat',
    price: 650,
    bedrooms: 2,
    bathrooms: 3,
    areaSqM: 150,
    description: 'A well-maintained apartment in a prime location. Offers a large living area, modern kitchen, and access to a shared gym and pool. Close to shopping malls and restaurants.',
    imageUrl: 'https://images.unsplash.com/photo-1594484208280-efa0ce3c894a?q=80&w=1920&auto=format&fit=crop',
    status: 'Available',
    buildingAge: '5 years',
  },
  {
    id: 'prop_3',
    title: 'Luxury Beachfront Villa',
    listingType: 'For Sale',
    propertyType: 'Villa',
    location: 'Shatti Al Qurum, Muscat',
    price: 750000,
    bedrooms: 6,
    bathrooms: 7,
    areaSqM: 800,
    description: 'An exclusive beachfront property with direct access to the sea. Features panoramic ocean views, a home cinema, and a private gym. The ultimate in luxury living.',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1920&auto=format&fit=crop',
    status: 'Available',
    buildingAge: '3 years',
  },
  {
    id: 'prop_4',
    title: 'Cozy 1-Bedroom Apartment',
    listingType: 'For Rent',
    propertyType: 'Apartment',
    location: 'Al Khuwair, Muscat',
    price: 350,
    bedrooms: 1,
    bathrooms: 2,
    areaSqM: 85,
    description: 'Perfect for a single professional or couple. This apartment is centrally located and comes fully furnished with modern amenities.',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1920&auto=format&fit=crop',
    status: 'Rented',
    buildingAge: '8 years',
  },
   {
    id: 'prop_5',
    title: 'Family Townhouse in Gated Community',
    listingType: 'For Sale',
    propertyType: 'Townhouse',
    location: 'Madinat Al Sultan Qaboos',
    price: 180000,
    bedrooms: 3,
    bathrooms: 4,
    areaSqM: 250,
    description: 'A beautiful townhouse in a family-friendly community with shared parks and play areas. Features a private backyard and spacious rooms.',
    imageUrl: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=1920&auto=format&fit=crop',
    status: 'Available',
    buildingAge: '6 years',
  },
  {
    id: 'prop_6',
    title: 'Penthouse with City Views',
    listingType: 'For Rent',
    propertyType: 'Apartment',
    location: 'Bawshar, Muscat',
    price: 1200,
    bedrooms: 3,
    bathrooms: 4,
    areaSqM: 300,
    description: 'A luxurious penthouse apartment with stunning views of the Muscat skyline. Features a large terrace, high ceilings, and premium appliances.',
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-406b9bce836d?q=80&w=1920&auto=format&fit=crop',
    status: 'Available',
    buildingAge: '2 years',
  },
   {
    id: 'prop_7',
    title: 'Commercial Office Space',
    listingType: 'For Rent',
    propertyType: 'Apartment',
    location: 'Ruwi, Muscat',
    price: 800,
    bedrooms: 0,
    bathrooms: 2,
    areaSqM: 200,
    description: 'A modern office space in the central business district. Shell and core, ready for custom fit-out. Includes 4 dedicated parking spots.',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1920&auto=format&fit=crop',
    status: 'Available',
    buildingAge: 'New',
  },
   {
    id: 'prop_8',
    title: 'Sohar Industrial Warehouse',
    listingType: 'For Sale',
    propertyType: 'Villa', // Should be changed to a more appropriate type
    location: 'Sohar Industrial Estate',
    price: 450000,
    bedrooms: 0,
    bathrooms: 4,
    areaSqM: 2000,
    description: 'Large-scale warehouse with high ceilings, loading bays, and attached office block. Suitable for manufacturing or logistics.',
    imageUrl: 'https://images.unsplash.com/photo-1567984852378-c3e10740a448?q=80&w=1920&auto=format&fit=crop',
    status: 'Sold',
    buildingAge: '4 years',
  },
];
