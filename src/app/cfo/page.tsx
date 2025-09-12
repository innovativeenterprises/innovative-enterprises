
'use client';

import CfoDashboard from "../admin/cfo-dashboard";
import { useSyncExternalStore } from 'react';
import { store } from '@/lib/global-store';
import { useCfoData } from '@/hooks/use-global-store-data';


export default function CfoPage() {
    const cfoData = useCfoData();

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <CfoDashboard {...cfoData} />
      </div>
    </div>
  );
}
