

import CfoDashboardClient from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "CFO Dashboard",
  description: "Financial overview and analysis of the business operations.",
};


export default async function CfoDashboardPage() {
    // Data is now managed client-side by the useCfoData hook.
    // This server component simply renders the client component.
    return <CfoDashboardClient />;
}
