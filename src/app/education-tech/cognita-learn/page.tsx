
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, Cpu, Gamepad2, BarChart, BookOpen, User, Target } from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: Target,
        title: "Personalized Learning Paths",
        description: "Our AI analyzes each student's learning style and pace to create a unique educational journey, ensuring no one is left behind."
    },
    {
        icon: Gamepad2,
        title: "Gamified Modules",
        description: "Boost engagement and knowledge retention with interactive, game-like lessons and challenges that make learning fun."
    },
    {
        icon: BarChart,
        title: "Real-time Analytics",
        description: "Teachers get a powerful dashboard to track student progress, identify learning gaps, and provide targeted support."
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
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary">Key Features</h2>
                        <p className="mt-4 text-lg text-muted-foreground">Building a smarter, more adaptive educational future.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <Card key={feature.title} className="text-center bg-card">
                                 <CardHeader className="items-center">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <feature.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <CardTitle className="pt-2">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
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
