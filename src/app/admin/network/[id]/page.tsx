
'use server';

import { getProviders } from '@/lib/firestore';
import ProviderProfileClientPage from './client-page';
import type { Metadata } from 'next';

export async function generateStaticParams() {
    const providers = await getProviders();
    return providers.map((provider) => ({
        id: provider.id,
    }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const providers = await getProviders();
  const provider = providers.find(p => p.id === params.id);

  if (!provider) {
    return {
      title: 'Provider Not Found',
    };
  }

  return {
    title: `${provider.name} | Partner Profile`,
    description: `Service provider profile for ${provider.name}, specializing in ${provider.services}.`,
  };
}

export default async function AdminProviderDetailPage({ params }: { params: { id: string } }) {
    const providers = await getProviders();
    const provider = providers.find(p => p.id === params.id);

    return <ProviderProfileClientPage provider={provider!} />;
}
