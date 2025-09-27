
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Client } from '@/lib/clients.schema';
import { Skeleton } from '@/components/ui/skeleton';
import { useClientsData } from '@/hooks/use-data-hooks.tsx';

export default function OverviewAvatars() {
    const { data: clients, isClient } = useClientsData();
    
    if (!isClient) {
        return <div className="flex -space-x-2 w-24 h-10 bg-gray-200 rounded-full animate-pulse" />;
    }
  
  const overviewClients = (clients || []).slice(0, 3);

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
