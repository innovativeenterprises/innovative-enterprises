
import TrainingForm from "./training-form";
import { BrainCircuit } from "lucide-react";

export default function TrainingCenterPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <BrainCircuit className="w-10 h-10 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Training Center</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Fine-tune your digital workforce. Provide your AI agents with custom knowledge and data to improve their performance and tailor them to your specific business needs. This service is managed by Neo, our AI Training Agent.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <TrainingForm />
        </div>
      </div>
    </div>
  );
}
