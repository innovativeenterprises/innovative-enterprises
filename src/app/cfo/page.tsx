

'use client';

import { useState, useEffect } from 'react';
import CfoDashboard from "../admin/cfo-dashboard";

export default function CfoPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <CfoDashboard />
      </div>
    </div>
  );
}
