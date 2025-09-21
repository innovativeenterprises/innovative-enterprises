
'use server';

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProperties } from '@/lib/firestore';
import ProviderProfileClientPage from './client-page';
import type { Property } from '@/lib/properties.schema';

interface PageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((property) => ({
    id: property.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const properties = await getProperties();
  const property = properties.find(p => p.id === params.id);

  if (!property) {
    notFound();
  }

  return {
    title: `${property.title} | Real Estate`,
    description: property.description,
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
    const { id } = params;
    const properties = await getProperties();
    const property = properties.find(p => p.id === id);

    if (!property) {
        notFound();
    }

    return <ProviderProfileClientPage property={property} />;
}
