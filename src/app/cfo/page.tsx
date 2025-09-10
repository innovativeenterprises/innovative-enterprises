
'use client';

import { useState, useEffect } from 'react';
import CfoDashboard from "../admin/cfo-dashboard";
import { useCfoData } from "@/hooks/use-global-store-data";

export default function CfoPage() {
  const { isClient } = useCfoData();

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <CfoDashboard isClient={isClient} />
      </div>
    </div>
  );
}
