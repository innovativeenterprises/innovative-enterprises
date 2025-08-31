
'use client';

import { useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, PlusCircle, Trash2, Annoyed, FileText, Clipboard, Download } from 'lucide-react';
import { ElectionGeneratorInputSchema, type ElectionGeneratorInput, type ElectionGeneratorOutput } from '@/ai/flows/community-elections-agent.schema';
import { generateElectionMaterials } from '@/ai/flows/community-elections-agent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ElectionsManagerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ElectionGeneratorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ElectionGeneratorInput>({
    resolver: zodResolver(ElectionGeneratorInputSchema),
    defaultValues: {
      communityName: '',
      electionTitle: '',
      positions: ['President', 'Vice-President', 'Treasurer'],
      nominationDeadline: '',
      electionDate: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "positions"
  });

  const onSubmit: SubmitHandler<ElectionGeneratorInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await generateElectionMaterials(data);
      setResponse(result);
      toast({ title: 'Election Materials Generated!', description: 'Your announcement, nomination form, and ballot are ready.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate materials. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyHtml = (htmlContent: string) => {
    navigator.clipboard.writeText(htmlContent);
    toast({ title: "HTML Copied!", description: "The HTML code has been copied to your clipboard." });
  };
  
  const handleDownloadHtml = (htmlContent: string, fileName: string) => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>AI Elections Manager</CardTitle>
          <CardDescription>Define your community election, and let the AI generate the necessary materials for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="communityName" render={({ field }) => (<FormItem><FormLabel>Community Name</FormLabel><FormControl><Input placeholder="e.g., The Omani Students Society" {...field} /></FormControl><FormMessage/></FormItem>)} />
                <FormField control={form.control} name="electionTitle" render={({ field }) => (<FormItem><FormLabel>Election Title</FormLabel><FormControl><Input placeholder="e.g., Annual Committee Election 2024" {...field} /></FormControl><FormMessage/></FormItem>)} />
              </div>
              <div>
                <FormLabel>Positions to be Elected</FormLabel>
                <div className="space-y-2 mt-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField control={form.control} name={`positions.${index}`} render={({ field }) => (<FormItem className="flex-grow"><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append('')}><PlusCircle className="mr-2 h-4 w-4"/> Add Position</Button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="nominationDeadline" render={({ field }) => (<FormItem><FormLabel>Nomination Deadline</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage/></FormItem>)} />
                 <FormField control={form.control} name="electionDate" render={({ field }) => (<FormItem><FormLabel>Election Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage/></FormItem>)} />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Materials...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Election Materials</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card><CardContent className="p-6 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /><p className="mt-4 text-muted-foreground">The AI is drafting your election documents...</p></CardContent></Card>
      )}

      {response && (
        <Card>
            <CardHeader><CardTitle>Generated Election Assets</CardTitle></CardHeader>
            <CardContent>
                <Tabs defaultValue="announcement">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="announcement">Announcement</TabsTrigger>
                        <TabsTrigger value="nomination">Nomination Form</TabsTrigger>
                        <TabsTrigger value="ballot">Ballot Paper</TabsTrigger>
                    </TabsList>
                    <TabsContent value="announcement">
                        <div className="mt-4 prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap">
                            {response.announcementText}
                        </div>
                    </TabsContent>
                     <TabsContent value="nomination">
                        <div className="mt-4 rounded-md border bg-muted p-4">
                            <div dangerouslySetInnerHTML={{ __html: response.nominationFormHtml }} />
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <Button variant="outline" size="sm" onClick={() => handleCopyHtml(response.nominationFormHtml)}><Clipboard className="mr-2 h-4 w-4"/>Copy HTML</Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadHtml(response.nominationFormHtml, 'nomination_form.html')}><Download className="mr-2 h-4 w-4"/>Download HTML</Button>
                        </div>
                    </TabsContent>
                     <TabsContent value="ballot">
                        <div className="mt-4 rounded-md border bg-muted p-4">
                            <div dangerouslySetInnerHTML={{ __html: response.ballotHtml }} />
                        </div>
                         <div className="flex justify-end gap-2 mt-2">
                            <Button variant="outline" size="sm" onClick={() => handleCopyHtml(response.ballotHtml)}><Clipboard className="mr-2 h-4 w-4"/>Copy HTML</Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadHtml(response.ballotHtml, 'ballot.html')}><Download className="mr-2 h-4 w-4"/>Download HTML</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
