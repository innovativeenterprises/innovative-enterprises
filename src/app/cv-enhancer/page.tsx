
'use client';

import CvForm from "./cv-form";
import InterviewCoachForm from "../interview-coach/coach-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Mic } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function CvEnhancerContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'cv';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'interview' || tab === 'cv') {
        setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">GENIUS Career Platform</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your end-to-end AI partner for career development. Enhance your CV to beat applicant tracking systems, then practice for your interview with our AI coach.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cv"><FileText className="mr-2 h-4 w-4"/> CV Enhancer</TabsTrigger>
                <TabsTrigger value="interview"><Mic className="mr-2 h-4 w-4"/> AI Interview Coach</TabsTrigger>
              </TabsList>
              <TabsContent value="cv" className="mt-6">
                <CvForm />
              </TabsContent>
              <TabsContent value="interview" className="mt-6">
                 <Card className="text-center">
                    <CardHeader>
                        <CardTitle>Feature Moved</CardTitle>
                        <CardDescription>
                            The AI Interview Coach has been moved to our Guardian AI platform for a more integrated student experience.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild>
                            <Link href="/education-tech/guardian-ai?tab=interview" legacyBehavior>Go to AI Interview Coach <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardContent>
                 </Card>
              </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function GeniusPlatformPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CvEnhancerContent />
        </Suspense>
    )
}
