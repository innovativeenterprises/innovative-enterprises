
'use server';

import { getProperties } from "@/lib/firestore";
import PropertyDetailClientPage from "./client-page";
import type { Metadata } from 'next';

export async function generateStaticParams() {
    const properties = await getProperties();
    return properties.map((property) => ({
        id: property.id,
    }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const properties = await getProperties();
  const property = properties.find(p => p.id === params.id);

  if (!property) {
    return {
      title: 'Property Not Found',
    };
  }

  return {
    title: `${property.title} | Real Estate`,
    description: property.description,
  };
}


export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
    const properties = await getProperties();
    const property = properties.find(p => p.id === params.id);

    return <PropertyDetailClientPage property={property} />;
}
