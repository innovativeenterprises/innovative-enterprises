
'use client';

import { ShieldCheck } from "lucide-react";
import EstimatorForm from "../cctv-estimator/estimator-form";

export default function SurveillanceEstimatorPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Security System Estimator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Get an instant, AI-powered proposal for your project's surveillance and security needs. Describe your project, and our AI Solutions Architect will design a system, list required equipment, and estimate the costs.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12">
            <EstimatorForm />
        </div>
      </div>
    </div>
  );
}
