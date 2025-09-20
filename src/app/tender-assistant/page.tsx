
import TenderForm from "./tender-form";
import { FileText } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Tender Response Assistant",
  description: "Save hours of work. Upload your tender documents and project requirements, and let our AI generate a comprehensive, professional draft response tailored to your company's strengths.",
};


export default function TenderAssistantPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <FileText className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Tender Response Assistant</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Save hours of work. Upload your tender documents and project requirements, and let our AI generate a comprehensive, professional draft response tailored to your company's strengths.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <TenderForm />
        </div>
      </div>
    </div>
  );
}
