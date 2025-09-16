import { ClipboardCheck } from 'lucide-react';
import QuizForm from './quiz-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Quiz Generator | Innovative Enterprises",
  description: "Enter any topic, and our AI will instantly generate a multiple-choice quiz, complete with answers and explanations. Perfect for educators and students.",
};

export default function QuizGeneratorPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16">
         <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <ClipboardCheck className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Quiz Generator</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Enter any topic, and our AI will instantly generate a multiple-choice quiz, complete with answers and explanations. Perfect for educators and students.
                </p>
            </div>
            <QuizForm />
         </div>
      </div>
    </div>
  );
}
