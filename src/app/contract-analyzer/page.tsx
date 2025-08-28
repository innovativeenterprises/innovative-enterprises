
import AnalysisForm from "./analysis-form";
import { Scale } from "lucide-react";

export default function ContractAnalyzerPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Scale className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Contract Risk Analyzer</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Leverage AI to uncover potential risks and ambiguities in your legal documents. This service is powered by Lexi, our AI Legal Analyst, ensuring a thorough and confidential review.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <AnalysisForm />
        </div>
      </div>
    </div>
  );
}
