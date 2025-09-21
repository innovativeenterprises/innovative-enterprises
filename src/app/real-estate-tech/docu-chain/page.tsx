

import { ClipboardCheck } from "lucide-react";
import DocuChainClientPage from "./client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "DocuChain Compliance | Innovative Enterprises",
  description: "Automate your real estate paperwork. Generate professional Tenancy or Sale Agreements tailored to your needs in seconds with our AI-powered tool.",
};


export default function DocuChainPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <ClipboardCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">DocuChain Compliance</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Automate your real estate paperwork. Fill in the details below to generate a professional Tenancy or Sale Agreement tailored to your needs.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
           <DocuChainClientPage />
        </div>
      </div>
    </div>
  );
}
