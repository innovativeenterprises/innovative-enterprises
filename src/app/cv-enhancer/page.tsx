
'use client';

import { useState } from 'react';
import CvForm from "./cv-form";
import InterviewCoachForm from "../interview-coach/coach-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Mic } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import React from 'react';


export default function GeniusPlatformPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') || 'cv';

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
          <React.Suspense fallback={<div>Loading...</div>}>
            <Tabs defaultValue={tab} className="w-full">
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
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
