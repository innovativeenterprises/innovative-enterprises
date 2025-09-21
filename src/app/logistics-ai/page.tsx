

'use client';

import { Truck } from "lucide-react";
import LogisticsSchedulerForm from "./scheduler-form";

export default function LogisticsAiPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Truck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Logistics Chain AI</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            An AI-powered platform to optimize your supply chain and logistics. Define your delivery tasks, vehicles, and destinations, and our AI will create an optimized, conflict-free schedule to maximize efficiency.
          </p>
        </div>
        <div className="max-w-6xl mx-auto mt-12 space-y-12">
            <LogisticsSchedulerForm />
        </div>
      </div>
    </div>
  );
}
