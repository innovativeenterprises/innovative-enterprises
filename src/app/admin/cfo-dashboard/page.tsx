
'use server';

import { getCfoData } from "@/lib/firestore";
import CfoDashboardClientPage from "./client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "CFO Dashboard",
  description: "Financial overview and analysis for your business operations.",
};


export default async function CfoDashboardPage() {
  const cfoData = await getCfoData();

  return (
    <CfoDashboardClientPage initialCfoData={cfoData} />
  );
}
