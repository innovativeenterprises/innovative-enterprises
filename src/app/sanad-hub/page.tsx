
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import TaskForm from './task-form';
import SanadHubIcon from '@/components/icons/sanad-hub-icon';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sanad Hub | Innovative Enterprises",
  description: "A digital gateway connecting you to Sanad Service Centres across Oman. Delegate government service tasks, receive competitive offers, and get your work done faster.",
};

export default function SanadHubPage() {

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <SanadHubIcon className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Sanad Hub: Your Digital Gateway to Government Services</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        A unified platform connecting you to Sanad Service Centres across Oman. Delegate tasks, receive competitive offers, and get your work done faster and more efficiently.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Button size="lg" asChild>
                           <a href="#task-form">Submit a Task <ArrowRight className="ml-2 h-5 w-5"/></a>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                           <Link href="/partner">For Sanad Offices</Link>
                        </Button>
                    </div>
                </div>

                <div id="task-form" className="max-w-4xl mx-auto mt-20">
                    <TaskForm />
                </div>

            </div>
        </div>
    );
}
