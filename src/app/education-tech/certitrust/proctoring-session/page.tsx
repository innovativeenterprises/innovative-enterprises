
import { Bot } from "lucide-react";
import ProctoringSessionForm from "./proctoring-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Proctoring Assistant | Innovative Enterprises",
  description: "Submit an exam session log for analysis. The AI will review the transcript for potential academic integrity violations.",
};

export default function ProctoringSessionPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
             <div className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <Bot className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Proctoring Assistant</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Submit an exam session log for analysis. The AI will review the transcript for potential academic integrity violations.
                </p>
            </div>
            <ProctoringSessionForm />
        </div>
      </div>
    </div>
  );
}
