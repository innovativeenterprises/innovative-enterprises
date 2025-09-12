
'use client';

import CfoDashboard from "../admin/cfo-dashboard";
import { useCfoData } from "@/hooks/use-global-store-data";

export default function CfoPage() {
  const cfoData = useCfoData();

  if (!cfoData.isClient) {
    // You can return a loading skeleton here if you want
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <CfoDashboard {...cfoData} />
      </div>
    </div>
  );
}
