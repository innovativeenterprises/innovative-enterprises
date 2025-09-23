
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { analyzeFinancialDocuments } from '@/ai/flows/financial-document-analysis';
import { type FinancialAnalysisOutput } from '@/ai/flows/financial-document-analysis.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, AlertTriangle, FileText, Percent, CheckCircle, Lightbulb, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { auditOffices } from '@/lib/audit-offices';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { fileToDataURI } from '@/lib/utils';
import type { Metadata } from 'next';
import AuditForm from '@/app/cfo/audit-form';


export const metadata: Metadata = {
  title: "Finley: AI CFO & Audit Assistant | Innovative Enterprises",
  description: "Get an expert-level preliminary audit of your financial documents. Upload your balance sheets, income statements, and more.",
};


export default function CfoPage() {
 
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <DollarSign className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Finley: AI CFO & Audit Assistant</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Get an expert-level preliminary audit of your financial documents. Upload your balance sheets, income statements, and more. Our AI agent, Finley, will analyze them for compliance, efficiency, and potential red flags.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 space-y-8">
            <AuditForm />
        </div>
      </div>
    </div>
  );
}
