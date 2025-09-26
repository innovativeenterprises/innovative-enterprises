
'use server';

import type { Metadata } from 'next';
import InvestClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Invest With Us | Innovative Enterprises",
  description: "Explore investment opportunities in our portfolio of 80+ AI-driven technology products and join our journey of innovation.",
};

export default async function InvestPage() {
    return (
        <InvestClientPage />
    );
}

    