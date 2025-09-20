
'use server';

import CooDashboardClientPage from "./client-page";
import { getProducts, getProviders, getCfoData } from "@/lib/firestore";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI COO Dashboard",
  description: "JADE's real-time operational analysis of the entire business ecosystem.",
};

export default async function CooDashboardPage() {
  const products = await getProducts();
  const providers = await getProviders();
  const cfoData = await getCfoData();

  return (
    <CooDashboardClientPage
      initialProducts={products}
      initialProviders={providers}
      initialKpiData={cfoData.kpiData}
    />
  );
}
