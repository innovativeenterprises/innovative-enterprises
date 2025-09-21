
'use server';

import InvestClientPage from "./client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Invest With Us | Innovative Enterprises",
  description: "Explore investment opportunities in our portfolio of 80+ AI-driven technology products and join our journey of innovation.",
};

export default function InvestPage() {
  return (
    <InvestClientPage />
  );
}
