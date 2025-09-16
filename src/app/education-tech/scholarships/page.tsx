import { GraduationCap } from 'lucide-react';
import ScholarshipFinderForm from './scholarship-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Scholarship Finder | Innovative Enterprises",
  description: "Enter your field of study and desired level to let our AI search for relevant scholarship opportunities.",
};

export default function ScholarshipFinderPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
         <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto space-y-8">
                 <div className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <GraduationCap className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Scholarship Finder</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Enter your field of study and desired level to let our AI search for relevant scholarship opportunities.
                    </p>
                </div>
                <ScholarshipFinderForm />
            </div>
        </div>
    </div>
  );
}
