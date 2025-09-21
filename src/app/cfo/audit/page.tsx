

'use client';

import AuditForm from "./audit-form";
import { DollarSign } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Finley: AI CFO & Audit Assistant | Innovative Enterprises",
  description: "Get an expert-level preliminary audit of your financial documents. Upload your balance sheets, income statements, and more.",
};

export default function CfoPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <DollarSign className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Finley: AI CFO & Audit Assistant</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Get an expert-level preliminary audit of your financial documents. Upload your balance sheets, income statements, and more. Our AI agent, Finley, will analyze them for compliance, efficiency, and potential red flags.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12">
            <AuditForm />
        </div>
      </div>
    </div>
  );
}
