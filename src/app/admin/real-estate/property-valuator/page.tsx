
'use server';

import ValuationForm from "@/app/real-estate-tech/property-valuator/valuation-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Property Valuator | Innovative Enterprises",
  description: "Get an instant, data-driven market valuation for your property. Provide the details below and let our AI analyze the market to give you an estimated value.",
};

export default function PropertyValuatorPage() {
  return (
      <ValuationForm />
  );
}
