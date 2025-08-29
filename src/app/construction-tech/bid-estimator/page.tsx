
import { DollarSign } from "lucide-react";
import EstimatorForm from "./estimator-form";

export default function BidEstimatorPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <DollarSign className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">BidWise Estimator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Automate your cost estimation and tender management. Upload a Bill of Quantities (BoQ) and let our AI provide a detailed cost breakdown and generate a professional tender response.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12">
            <EstimatorForm />
        </div>
      </div>
    </div>
  );
}
