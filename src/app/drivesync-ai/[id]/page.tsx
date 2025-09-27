'use server';

import { getCars } from '@/lib/firestore';
import CarDetailClientPage from './client-page';
import type { Metadata } from 'next';

export async function generateStaticParams() {
    const cars = await getCars();
    return cars.map((car) => ({
        id: car.id,
    }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const cars = await getCars();
  const car = cars.find(p => p.id === params.id);

  if (!car) {
    return {
      title: 'Car Not Found',
    };
  }

  return {
    title: `${car.make} ${car.model} | DriveSync AI`,
    description: `Details for the ${car.year} ${car.make} ${car.model}, available for rent.`,
  };
}

export default async function CarDetailPage({ params }: { params: { id: string } }) {
    const cars = await getCars();
    const car = cars.find(p => p.id === params.id);
    
    return <CarDetailClientPage car={car} />;
}
