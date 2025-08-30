
'use client';

import { GanttChartSquare, UserCheck, ArrowRight } from "lucide-react";
import TimetableForm from "./timetable-form";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function EduFlowPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <GanttChartSquare className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">EduFlow Suite</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            An all-in-one administrative automation platform for schools, featuring smart timetabling, automated admissions workflows, and AI-powered resource allocation.
          </p>
        </div>
        <div className="max-w-6xl mx-auto mt-12 space-y-12">
            <Card className="bg-accent/10 border-accent">
                <CardHeader>
                    <CardTitle className="text-2xl text-accent flex items-center gap-3">
                       <UserCheck /> AI Admissions Officer
                    </CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                        Automate the initial review of student applications. Our AI analyzes submissions, checks for completeness, and provides a readiness score to help your team focus on the best-fit candidates.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/education-tech/admissions">
                            Try the Admissions Tool <ArrowRight className="ml-2 h-4 w-4"/>
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
            <TimetableForm />
        </div>
      </div>
    </div>
  );
}
