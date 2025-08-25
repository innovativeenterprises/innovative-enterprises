
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Route, GitPullRequest, LayoutDashboard, Rocket, User, Building, ArrowRight } from "lucide-react";
import TaskForm from './task-form';

const features = [
    {
        icon: Route,
        title: "Smart Task Routing",
        description: "Our platform intelligently matches your service request with the most suitable Sanad office based on location, specialization, and availability.",
    },
    {
        icon: GitPullRequest,
        title: "Competitive Bidding",
        description: "Receive multiple offers from verified Sanad offices, allowing you to choose the best price and service level for your needs.",
    },
    {
        icon: LayoutDashboard,
        title: "Digital Dashboard",
        description: "Track the progress of your tasks, communicate securely with offices, and manage all your documents in one centralized place.",
    },
    {
        icon: Rocket,
        title: "Streamlined Business Setup",
        description: "Accelerate your entrepreneurial journey with simplified processes for business registration, licensing, and compliance.",
    },
];

const targetUsers = [
    { icon: User, name: "Citizens & Residents" },
    { icon: Rocket, name: "Entrepreneurs & Startups" },
    { icon: Building, name: "Sanad Service Centres" },
];


export default function SanadHubPage() {
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleGetStarted = () => {
        setIsFormVisible(true);
        // Scroll to the form section smoothly
        const formElement = document.getElementById('task-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Sanad Hub: Your Digital Gateway to Government Services</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A unified platform connecting you to Sanad Service Centres across Oman. Delegate tasks, receive competitive offers, and get your work done faster and more efficiently.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Button size="lg" onClick={handleGetStarted}>
                            Submit a Task <ArrowRight className="ml-2 h-5 w-5"/>
                        </Button>
                        <Button size="lg" variant="outline">
                            For Sanad Offices
                        </Button>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary">Platform Features</h2>
                        <p className="mt-4 text-lg text-muted-foreground">Everything you need to streamline your service requests.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature) => (
                            <Card key={feature.title} className="bg-card border-l-4 border-primary/50">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div id="task-form" className="max-w-3xl mx-auto mt-20">
                    {isFormVisible && <TaskForm />}
                </div>

            </div>
        </div>
    );
}
