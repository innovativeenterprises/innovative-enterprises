
'use client';

import CvForm from "./cv-form";
import InterviewCoachForm from "../interview-coach/coach-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Mic } from "lucide-react";
import type { Metadata } from "next";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";

export const metadata: Metadata = {
  title: "GENIUS Career Platform",
  description: "Your end-to-end AI partner for career development. Enhance your CV to beat applicant tracking systems, then practice for your interview with our AI coach.",
};


export default function GeniusPlatformPage() {
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
                 <InterviewCoachForm />
              </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}
