

'use client';

import { GanttChartSquare, UserCheck, ArrowRight, ClipboardCheck, DollarSign, Users, Cpu } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function WorkforceFlowPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <GanttChartSquare className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">WorkforceFlow</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            An AI-driven platform for workforce scheduling, digital timecards with face recognition, and IoT equipment tracking to optimize your construction site operations.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <GanttChartSquare className="h-8 w-8 text-primary" />
                        <CardTitle className="text-2xl">AI Work Scheduler</CardTitle>
                    </div>
                    <CardDescription>
                        Define your tasks, teams, and job sites. Our AI will generate an optimized, conflict-free work schedule for your construction project.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                    <Button asChild className="w-full">
                        <Link href="/education-tech/eduflow/timetable-generator">
                            Launch Scheduler <ArrowRight className="ml-2 h-4 w-4"/>
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <UserCheck className="h-8 w-8 text-primary" />
                        <CardTitle className="text-2xl">Digital Timecards</CardTitle>
                    </div>
                    <CardDescription>
                       (Coming Soon) Use facial recognition for secure and accurate employee check-in and check-out, eliminating time theft and manual entry.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                    <Button asChild className="w-full" variant="secondary" disabled>
                        <Link href="#">
                            Coming Soon
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
             <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <Cpu className="h-8 w-8 text-primary" />
                        <CardTitle className="text-2xl">IoT Equipment Tracking</CardTitle>
                    </div>
                    <CardDescription>
                       (Coming Soon) Monitor the location and usage of your valuable equipment in real-time across all your project sites.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                    <Button asChild className="w-full" variant="secondary" disabled>
                        <Link href="#">
                            Coming Soon
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
