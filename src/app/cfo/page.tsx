
import CfoDashboardClient from './client-page';
import { getCfoData } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Fintech Super-App | Innovative Enterprises",
  description: "An integrated financial services application providing AI-driven auditing, financial analysis, and CFO dashboard capabilities, powered by our AI agent, Finley.",
};

export default async function CfoPage() {
  const cfoData = await getCfoData();

  return <CfoDashboardClient cfoData={cfoData} />;
}
