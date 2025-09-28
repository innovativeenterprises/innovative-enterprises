
import { GanttChartSquare, UserCheck, ArrowRight, ClipboardCheck, DollarSign, Users, Home } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "EduFlow Suite | Innovative Enterprises",
    description: "An all-in-one administrative automation platform for schools, featuring smart timetabling, automated admissions workflows, and AI-powered resource allocation.",
};

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
            <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <GanttChartSquare className="h-8 w-8 text-primary" />
                            <CardTitle className="text-2xl">AI Smart Timetable</CardTitle>
                        </div>
                        <CardDescription>
                            Define your subjects, teachers, and classrooms. Our AI will generate an optimized, conflict-free schedule, saving you hours of manual work.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                        <Button asChild className="w-full">
                            <Link href="/education-tech/eduflow/timetable-generator" legacyBehavior>
                                Launch Timetable Generator <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <UserCheck className="h-8 w-8 text-primary" />
                            <CardTitle className="text-2xl">AI Admissions Officer</CardTitle>
                        </div>
                        <CardDescription>
                           Automate the initial review of student applications. Our AI provides a readiness score to help your team focus on the best-fit candidates.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                        <Button asChild className="w-full">
                            <Link href="/education-tech/admissions" legacyBehavior>
                                Launch Admissions Tool <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                 <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <ClipboardCheck className="h-8 w-8 text-primary" />
                            <CardTitle className="text-2xl">AI Quiz Generator</CardTitle>
                        </div>
                        <CardDescription>
                           Instantly create engaging multiple-choice quizzes on any topic, complete with answers and explanations, for any difficulty level.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                        <Button asChild className="w-full">
                            <Link href="/education-tech/quiz-generator" legacyBehavior>
                                Launch Quiz Generator <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                 <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <DollarSign className="h-8 w-8 text-primary" />
                            <CardTitle className="text-2xl">Student Financials</CardTitle>
                        </div>
                        <CardDescription>
                           Manage tuition fees, scholarships, and payments in a centralized dashboard. Track revenue and outstanding balances.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                        <Button asChild className="w-full">
                            <Link href="/education-tech/student-financials" legacyBehavior>
                                Launch Financials <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="h-8 w-8 text-primary" />
                            <CardTitle className="text-2xl">Student Records</CardTitle>
                        </div>
                        <CardDescription>
                           A central database to manage all student profiles, academic records, and contact information.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                        <Button asChild className="w-full">
                            <Link href="/education-tech/student-records" legacyBehavior>
                                Manage Records <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                 <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <Home className="h-8 w-8 text-primary" />
                            <CardTitle className="text-2xl">Student Housing</CardTitle>
                        </div>
                        <CardDescription>
                           Manage student housing agreements and payments via the integrated SmartLease Manager.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                        <Button asChild className="w-full">
                            <Link href="/education-tech/student-housing" legacyBehavior>
                                Launch Housing Manager <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
          </div>
      </div>
  );
}
