
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2, BookOpen, Presentation, FileText, Bot, Copy, Download } from 'lucide-react';
import { generateGamifiedLesson, type GamifiedLessonOutput } from '@/ai/flows/lesson-gamifier';
import { fileToDataURI } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FormSchema = z.object({
  documentFile: z.any().refine(file => file?.length == 1, 'A lesson document file is required.'),
  topic: z.string().min(3, "Please provide a topic for the lesson."),
  targetAudience: z.string().min(3, "Please specify the target audience (e.g., Grade 5 students)."),
});
type FormValues = z.infer<typeof FormSchema>;

const Flashcard = ({ term, definition }: { term: string, definition: string }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div className="w-full h-40 perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                <div className="absolute w-full h-full backface-hidden rounded-lg bg-card border flex items-center justify-center p-4">
                    <p className="text-xl font-semibold text-center">{term}</p>
                </div>
                <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg bg-primary text-primary-foreground flex items-center justify-center p-4">
                    <p className="text-center">{definition}</p>
                </div>
            </div>
        </div>
    );
};


export default function LessonGamifierPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GamifiedLessonOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { topic: '', targetAudience: '' },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
        const documentUri = await fileToDataURI(data.documentFile[0]);
        const result = await generateGamifiedLesson({ ...data, documentUri });
        setResponse(result);
        toast({ title: "Lesson Gamified!", description: "Your new learning materials are ready." });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate materials. The document might be too complex.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied to Clipboard!" });
  };
  
  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Lesson Gamifier</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Upload a school book chapter or lesson plan, and watch our AI transform it into a suite of engaging learning materials.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Learning Materials</CardTitle>
                    <CardDescription>Provide the lesson document and some context for the AI.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="documentFile"
                                render={({ field }) => (
                                    <FormItem><FormLabel>Lesson Document (PDF, TXT, DOCX)</FormLabel><FormControl><Input type="file" accept=".pdf,.txt,.docx" onChange={(e) => field.onChange(e.target.files)} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                            <div className="grid md:grid-cols-2 gap-6">
                                 <FormField control={form.control} name="topic" render={({ field }) => (<FormItem><FormLabel>Lesson Topic</FormLabel><FormControl><Input placeholder="e.g., The Water Cycle" {...field} /></FormControl><FormMessage/></FormItem>)} />
                                 <FormField control={form.control} name="targetAudience" render={({ field }) => (<FormItem><FormLabel>Target Audience</FormLabel><FormControl><Input placeholder="e.g., Grade 5 Science Students" {...field} /></FormControl><FormMessage/></FormItem>)} />
                            </div>
                            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating...</> : <><Wand2 className="mr-2 h-4 w-4"/> Gamify Lesson</>}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {isLoading && (
                <Card><CardContent className="p-10 text-center"><Loader2 className="h-10 w-10 animate-spin text-primary mx-auto"/><p className="mt-4 text-muted-foreground">The AI is transforming your lesson...</p></CardContent></Card>
            )}

            {response && (
                <Card>
                    <CardHeader>
                        <CardTitle>Generated Learning Materials for "{form.getValues('topic')}"</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="book">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="book">Interactive Book</TabsTrigger>
                                <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                                <TabsTrigger value="ppt">Presentation Outline</TabsTrigger>
                                <TabsTrigger value="pdf">Study Guide</TabsTrigger>
                            </TabsList>
                            <TabsContent value="book" className="mt-4">
                                <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-[60vh] overflow-y-auto" dangerouslySetInnerHTML={{ __html: response.interactiveBookHtml }} />
                                <div className="flex justify-end mt-2"><Button variant="outline" size="sm" onClick={() => handleDownload(response.interactiveBookHtml, 'interactive-book.html')}><Download className="mr-2 h-4 w-4"/>Download HTML</Button></div>
                            </TabsContent>
                            <TabsContent value="flashcards" className="mt-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[60vh] overflow-y-auto pr-4">
                                    {response.flashcards.map((card, i) => <Flashcard key={i} term={card.term} definition={card.definition} />)}
                                </div>
                            </TabsContent>
                            <TabsContent value="ppt" className="mt-4">
                                <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-[60vh] overflow-y-auto">
                                    {response.powerpointOutline.slides.map((slide, i) => (
                                        `<h3 key=${i}>Slide ${i+1}: ${slide.title}</h3><ul>${slide.bulletPoints.map(p => `<li key=${p}>${p}</li>`).join('')}</ul>`
                                    )).join('').replace(/<h3/g, '\n<h3')}
                                </div>
                                <div className="flex justify-end mt-2"><Button variant="outline" size="sm" onClick={() => handleCopy(response.powerpointOutline.slides.map((s,i) => `Slide ${i+1}: ${s.title}\n` + s.bulletPoints.map(p => `- ${p}`).join('\n')).join('\n\n'))}><Copy className="mr-2 h-4 w-4"/>Copy Outline</Button></div>
                            </TabsContent>
                            <TabsContent value="pdf" className="mt-4">
                                 <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-[60vh] overflow-y-auto">{response.summaryPdfContent}</div>
                                 <div className="flex justify-end mt-2"><Button variant="outline" size="sm" onClick={() => handleDownload(response.summaryPdfContent, 'study-guide.md')}><Download className="mr-2 h-4 w-4"/>Download Markdown</Button></div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
