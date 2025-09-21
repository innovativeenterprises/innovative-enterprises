

'use client';

import ValuationForm from "@/app/real-estate-tech/property-valuator/valuation-form";
import { BarChart } from "lucide-react";

export default function PropertyValuatorPage() {
  return (
      <div className="space-y-8">
            <div className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <BarChart className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Property Valuator</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Get an instant, data-driven market valuation for your property. Provide the details below and let our AI analyze the market to give you an estimated value.
                </p>
            </div>
            <div className="max-w-4xl mx-auto mt-12">
                <ValuationForm />
            </div>
        </div>
  );
}
