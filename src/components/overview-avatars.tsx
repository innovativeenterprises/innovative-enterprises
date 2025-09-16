
'use client';

import { useStoreData } from '@/hooks/use-global-store-data';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export default function OverviewAvatars() {
  const { overviewAvatars, isClient } = useStoreData(state => ({
    overviewAvatars: state.overviewAvatars,
    isClient: true,
  }));

  if (!isClient) {
    return <Skeleton className="h-10 w-24" />;
  }

  return (
    <div className="flex -space-x-2">
      {overviewAvatars.map((avatar, index) => (
        <Image
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          width={40}
          height={40}
          className="rounded-full border-2 border-background"
          data-ai-hint={avatar.aiHint}
        />
      ))}
    </div>
  );
}
