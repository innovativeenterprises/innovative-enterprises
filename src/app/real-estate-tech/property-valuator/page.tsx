
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Check, TrendingUp, Banknote, MapPin, Building, BedDouble, Bath, BarChart } from 'lucide-react';
import { PropertyValuationInputSchema, type PropertyValuationInput, type PropertyValuationOutput } from '@/ai/flows/property-valuation.schema';
import { evaluateProperty } from '@/ai/flows/property-valuation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fileToDataURI } from '@/lib/utils';
import ValuationForm from './valuation-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Property Valuator | Innovative Enterprises",
  description: "Get an instant, data-driven market valuation for your property. Provide the details below and let our AI analyze the market to give you an estimated value.",
};


export default function PropertyValuatorPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <BarChart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Property Valuator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Get an instant, data-driven market valuation for your property. Provide the details below and let our AI analyze the market to give you an estimated value.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12">
            <ValuationForm />
        </div>
      </div>
    </div>
  );
}
