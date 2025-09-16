
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import imageData from '@/app/lib/placeholder-images.json';

export default function OverviewAvatars() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <Skeleton className="h-10 w-24" />;
  }

  return (
    <div className="flex -space-x-2">
      {imageData.overviewAvatars.map((avatar, index) => (
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
