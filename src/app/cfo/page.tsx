import { DollarSign } from "lucide-react";
import AuditForm from "./audit-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Finley CFO: AI-Powered Financial Auditing",
  description: "Your AI-powered Chief Financial Officer. Upload financial documents, and our AI will conduct a preliminary audit, identify key metrics, and flag potential red flags.",
};


export default function CfoPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <DollarSign className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Finley CFO: AI-Powered Financial Auditing</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your AI-powered Chief Financial Officer. Upload your financial documents, and our AI will conduct a preliminary audit, identify key metrics, and flag potential red flags for your review before forwarding to a certified audit office.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <AuditForm />
        </div>
      </div>
    </div>
  );
}
