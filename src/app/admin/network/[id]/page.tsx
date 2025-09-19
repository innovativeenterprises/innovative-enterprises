import ProviderProfilePage from '@/app/provider/[id]/page';
import type { Metadata } from 'next';
import { getProviders } from '@/lib/firestore';

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

// This page now directly renders the client component from the public-facing route.
// This avoids code duplication while maintaining separate authenticated and public URLs.
export default function AdminProviderDetailPage() {
    return <ProviderProfilePage />;
}
