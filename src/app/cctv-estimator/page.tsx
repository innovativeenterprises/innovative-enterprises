
import QuotationForm from "./quotation-form";
import { Server } from "lucide-react";

export default function IctEstimatorPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Server className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI-Powered ICT Estimator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Get an instant, AI-powered proposal for your project's complete technology needs. Describe your event or project, and our AI Solutions Architect will design a system, recommend hardware for rent or purchase, and estimate the costs.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <QuotationForm />
        </div>
      </div>
    </div>
  );
}
