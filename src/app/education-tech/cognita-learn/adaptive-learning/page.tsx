
import { BrainCircuit } from 'lucide-react';
import AdaptiveLearningForm from './adaptive-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Adaptive Learning Tutor | Innovative Enterprises",
  description: "Struggling with a concept? Tell our AI tutor what you're having trouble with, and it will generate a custom explanation just for you.",
};

export default function AdaptiveLearningPage() {
  return (
    <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <BrainCircuit className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Adaptive Learning Tutor</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Struggling with a concept? Tell our AI tutor what you're having trouble with, and it will generate a custom explanation just for you.
                    </p>
                </div>
                <AdaptiveLearningForm />
            </div>
        </div>
    </div>
  );
}
