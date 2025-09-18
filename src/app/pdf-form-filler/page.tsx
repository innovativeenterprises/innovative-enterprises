
import FormFiller from "./form-filler";
import { FileText } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI PDF Form Filler | Innovative Enterprises",
  description: "Tired of manually filling out forms? Upload a PDF, and our AI will intelligently fill it out using your profile data, saving you time and effort.",
};

export default function PdfFormFillerPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <FileText className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI PDF Form Filler</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tired of manually filling out forms? Upload a PDF, and our AI will intelligently fill it out using your profile data, saving you time and effort.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12">
            <FormFiller />
        </div>
      </div>
    </div>
  );
}
