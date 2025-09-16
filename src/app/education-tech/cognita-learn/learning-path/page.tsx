
import { BrainCircuit } from 'lucide-react';
import LearningPathForm from './learning-path-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Learning Path Generator | Innovative Enterprises",
  description: "Define your learning goal and let our AI curriculum designer create a structured, step-by-step learning path for you.",
};

export default function LearningPathGeneratorPage() {
  return (
    <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <BrainCircuit className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Learning Path Generator</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Define your learning goal and let our AI curriculum designer create a structured, step-by-step learning path for you.
                    </p>
                </div>
                <LearningPathForm />
            </div>
        </div>
    </div>
  );
}
