
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Cpu, Target, BrainCircuit, ClipboardCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "CognitaLearn - Adaptive Learning Platform | Innovative Enterprises",
  description: "Moving beyond one-size-fits-all education. CognitaLearn uses AI to create personalized, engaging, and effective learning experiences for every student.",
};

const platformPillars = [
    {
        icon: Target,
        title: "AI Learning Path Generator",
        description: "Generate a custom, step-by-step curriculum for any subject, tailored to your skill level.",
        href: "/education-tech/cognita-learn/learning-path",
        cta: "Create a Path"
    },
    {
        icon: BrainCircuit,
        title: "Adaptive Learning Tutor",
        description: "Struggling with a specific concept? Get a personalized explanation from our AI tutor.",
        href: "/education-tech/cognita-learn/adaptive-learning",
        cta: "Ask the Tutor"
    },
    {
        icon: ClipboardCheck,
        title: "AI Quiz Generator",
        description: "Instantly create practice quizzes on any topic to test your knowledge and prepare for exams.",
        href: "/education-tech/quiz-generator",
        cta: "Generate a Quiz"
    }
];

export default function CognitaLearnPage() {
    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Cpu className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">CognitaLearn: Adaptive Learning Platform</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Moving beyond one-size-fits-all education. CognitaLearn uses AI to create personalized, engaging, and effective learning experiences for every student.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto mt-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        {platformPillars.map((pillar) => (
                             <Card key={pillar.title} className="text-center bg-card flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <CardHeader className="items-center">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <pillar.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <CardTitle className="pt-2">{pillar.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground">{pillar.description}</p>
                                </CardContent>
                                <CardFooter>
                                     <Button asChild className="w-full">
                                        <Link href={pillar.href} legacyBehavior>{pillar.cta} <ArrowRight className="ml-2 h-4 w-4"/></Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                 <div className="max-w-3xl mx-auto mt-20 text-center">
                    <Card className="bg-accent/10 border-accent">
                        <CardHeader>
                            <CardTitle className="text-2xl text-accent">Transform Your Teaching Methodology</CardTitle>
                            <CardDescription className="text-accent-foreground/80">
                               CognitaLearn is currently in the planning phase. Contact us to become a pilot partner and help us shape the future of personalized education.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="justify-center">
                            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Link href="/partner">Request a Demo</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
