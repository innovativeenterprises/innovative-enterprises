import { Siren } from "lucide-react";
import FireSafetyForm from "./fire-safety-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Fire & Safety Estimator | Innovative Enterprises",
  description: "Upload your building's floor plan and provide some basic details. Our AI will generate a preliminary list of required fire alarm and firefighting equipment, along with a cost estimate, and show you a proposed layout.",
};

export default function FireSafetyEstimatorPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Siren className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Fire & Safety Estimator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Upload your building's floor plan and provide some basic details. Our AI will generate a preliminary list of required fire alarm and firefighting equipment, along with a cost estimate, and show you a proposed layout.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12">
            <FireSafetyForm />
        </div>
      </div>
    </div>
  );
}
