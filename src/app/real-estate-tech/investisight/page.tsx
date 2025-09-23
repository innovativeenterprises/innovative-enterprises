
'use server';

import { BarChart } from "lucide-react";
import InvestisightForm from "./investisight-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "InvestiSight AI | Innovative Enterprises",
  description: "Make informed real estate investment decisions. Use our calculators to forecast ROI, simulate mortgage payments, and analyze rental yields.",
};

export default function InvestisightPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <BarChart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">InvestiSight AI</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Make informed real estate investment decisions. Use our calculators to forecast ROI, simulate mortgage payments, and analyze rental yields.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12">
            <InvestisightForm />
        </div>
      </div>
    </div>
  );
}
