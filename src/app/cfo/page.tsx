
'use client';

import CfoDashboard from "../admin/cfo-dashboard";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Finley CFO Dashboard | Innovative Enterprises",
  description: "AI-powered CFO dashboard to monitor financial health, track transactions, and view cash flow for your business operations.",
};

export default function CfoPage() {
  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <CfoDashboard />
      </div>
    </div>
  );
}
