
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { sanadServiceGroups } from '@/lib/sanad-services';

const FormSchema = z.object({
  serviceType: z.string().min(1, "Please select a service type."),
  taskDescription: z.string().min(20, "Please provide a more detailed description (at least 20 characters)."),
  documentFiles: z.any().optional(),
});
type FormValues = z.infer<typeof FormSchema>;


export default function TaskForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        serviceType: '',
        taskDescription: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    console.log("Submitting Sanad Hub Task:", data);

    // Simulate API call to task routing engine
    await new Promise(res => setTimeout(res, 2000));
    
    toast({
        title: "Task Submitted Successfully!",
        description: "Your request has been routed to eligible Sanad offices. You will receive offers shortly.",
    });
    setIsSubmitted(true);
    setIsLoading(false);
  };

  if (isSubmitted) {
      return (
        <Card>
            <CardContent className="p-10 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl">Your Task is On Its Way!</CardTitle>
                        <CardDescription>
                            We've sent your request to our network of Sanad offices. You will be notified in your dashboard as soon as offers start coming in.
                        </CardDescription>
                    </div>
                    <Button onClick={() => { setIsSubmitted(false); form.reset(); }}>Submit Another Task</Button>
                </div>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a New Service Request</CardTitle>
        <CardDescription>Describe the task you need help with, and we'll connect you with the right Sanad office.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the service you need..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {Object.entries(sanadServiceGroups).map(([group, services]) => (
                            <SelectGroup key={group}>
                                <SelectLabel>{group}</SelectLabel>
                                {services.map(service => (
                                    <SelectItem key={service} value={service}>{service}</SelectItem>
                                ))}
                            </SelectGroup>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="taskDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide all relevant details, such as names, CR numbers, visa types, deadlines, etc."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="documentFiles"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Attach Documents (Optional)</FormLabel>
                    <FormControl>
                        <Input type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormDescription>Upload any required forms, IDs, or supporting documents.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting Task...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> Find a Sanad Office</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
