
'use client';

import Image from 'next/image';
import type { Client } from '@/lib/clients.schema';

export default function OverviewAvatars({ clients }: { clients: Client[] }) {
  const overviewClients = clients.slice(0, 3);

  return (
    <div className="flex -space-x-2">
      {overviewClients.map((client) => (
        <Image
          key={client.id}
          src={client.logo}
          alt={client.name}
          width={40}
          height={40}
          className="rounded-full border-2 border-background object-contain bg-white"
          data-ai-hint={client.aiHint}
        />
      ))}
    </div>
  );
}
