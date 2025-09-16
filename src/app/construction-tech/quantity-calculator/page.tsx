
import { Calculator } from "lucide-react";
import CalculatorForm from "./calculator-form";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Bill of Quantities (BoQ) Generator | Innovative Enterprises",
  description: "Upload your building floor plan and let our AI Quantity Surveyor analyze the plan and generate a preliminary Bill of Quantities for your construction project.",
};

export default function QuantityCalculatorPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Calculator className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Bill of Quantities (BoQ) Generator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Upload your building floor plan and specify your project details. Our AI Quantity Surveyor will analyze the plan and generate a preliminary Bill of Quantities for you.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12">
            <CalculatorForm />
        </div>
      </div>
    </div>
  );
}
