
import LegalForm from "./legal-form";
import { NotebookText } from "lucide-react";

export default function LegalAgentPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <NotebookText className="w-10 h-10 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Admin & Legal Assistant</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Get preliminary legal analysis, draft agreements, or ask general questions. This service is powered by Aida, our AI assistant.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <LegalForm />
        </div>
      </div>
    </div>
  );
}
