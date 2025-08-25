
import InterviewCoachForm from "./coach-form";
import { Mic } from "lucide-react";

export default function InterviewCoachPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Mic className="w-10 h-10 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Interview Coach</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Prepare for your next job interview with our AI-powered coach. Get tailored questions for your target role and practice your answers in a simulated environment.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <InterviewCoachForm />
        </div>
      </div>
    </div>
  );
}
