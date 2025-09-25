

'use server';

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCars } from '@/lib/firestore';
import CarDetailClientPage from './client-page';

export async function generateStaticParams() {
  const cars = await getCars();
  return cars.map((car) => ({
    id: car.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const cars = await getCars();
  const car = cars.find(c => c.id === params.id);

  if (!car) {
    return {
      title: 'Car Not Found',
    };
  }

  return {
    title: `${car.make} ${car.model} | DriveSync AI`,
    description: `Details for the ${car.year} ${car.make} ${car.model}.`,
  };
}

export default async function CarDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const cars = await getCars();
    const car = cars.find(c => c.id === id);

    if (!car) {
        notFound();
    }
    
    return <CarDetailClientPage car={car} />;
}
