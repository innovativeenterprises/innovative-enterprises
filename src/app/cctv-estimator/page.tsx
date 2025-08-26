
import QuotationForm from "./quotation-form";
import { Video } from "lucide-react";

export default function CctvEstimatorPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Video className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Smart CCTV & Surveillance Estimator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Get an instant, AI-powered quotation for your surveillance system needs. Simply provide your requirements, upload a sketch of your building, and our agent will design a system and estimate the costs.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <QuotationForm />
        </div>
      </div>
    </div>
  );
}
