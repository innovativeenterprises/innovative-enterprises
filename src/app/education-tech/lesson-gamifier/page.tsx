
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2, BookOpen, Presentation, FileText, Bot, Copy, Download, Share2, Link as LinkIcon } from 'lucide-react';
import { generateGamifiedLesson, type GamifiedLessonOutput, type GamificationType } from '@/ai/flows/lesson-gamifier';
import { fileToDataURI } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const gamificationOptions: { id: GamificationType; label: string }[] = [
    { id: 'interactiveBookHtml', label: 'Interactive Book' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'powerpointOutline', label: 'Presentation Outline' },
    { id: 'summaryPdfContent', label: 'PDF Study Guide' },
];

const FormSchema = z.object({
  documentFile: z.any().refine(file => file?.length == 1, 'A lesson document file is required.'),
  topic: z.string().min(3, "Please provide a topic for the lesson."),
  targetAudience: z.string().min(3, "Please specify the target audience (e.g., Grade 5 students)."),
  outputs: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You have to select at least one output type.",
  }),
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
    defaultValues: { 
        topic: '', 
        targetAudience: '',
        outputs: ['interactiveBookHtml', 'flashcards'] 
    },
  });
  
  const watchOutputs = form.watch('outputs');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
        const documentUri = await fileToDataURI(data.documentFile[0]);
        const result = await generateGamifiedLesson({ 
            topic: data.topic,
            targetAudience: data.targetAudience,
            documentUri,
            outputs: data.outputs as GamificationType[],
         });
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
  
  const handleShare = () => {
      navigator.clipboard.writeText('https://innovative.om/shared-resource/placeholder');
      toast({ title: "Link Copied!", description: "A shareable link has been copied to your clipboard."});
  }
  
  const handleDriveConnect = (drive: 'Google' | 'Microsoft') => {
      toast({ title: `Connecting to ${drive} Drive...`, description: "This feature is coming soon!"})
  }

  const generatedTabs = gamificationOptions.filter(opt => response && response[opt.id]);


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

                             <FormField
                                control={form.control}
                                name="outputs"
                                render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel>Select Desired Outputs</FormLabel>
                                        <FormDescription>Choose which materials you want the AI to generate.</FormDescription>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                    {gamificationOptions.map((item) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="outputs"
                                            render={({ field }) => {
                                                return (
                                                <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...(field.value || []), item.id])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                (value) => value !== item.id
                                                                )
                                                            )
                                                        }}
                                                    />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                    {item.label}
                                                    </FormLabel>
                                                </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <div className="flex items-center space-x-2">
                                <Checkbox id="ai-decide" checked={watchOutputs.length === 0} onCheckedChange={(checked) => form.setValue('outputs', checked ? [] : ['interactiveBookHtml'])} />
                                <Label htmlFor="ai-decide" className="text-sm font-medium">Let AI Decide</Label>
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
                        <Tabs defaultValue={generatedTabs[0]?.id}>
                            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${generatedTabs.length}, minmax(0, 1fr))` }}>
                                {generatedTabs.map(opt => <TabsTrigger key={opt.id} value={opt.id}>{opt.label}</TabsTrigger>)}
                            </TabsList>
                            
                            {response.interactiveBookHtml && (
                                <TabsContent value="interactiveBookHtml" className="mt-4">
                                    <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-[60vh] overflow-y-auto" dangerouslySetInnerHTML={{ __html: response.interactiveBookHtml }} />
                                    <div className="flex justify-end mt-2 gap-2"><Button variant="outline" size="sm" onClick={handleShare}><Share2 className="mr-2 h-4 w-4"/>Share</Button><Button variant="outline" size="sm" onClick={() => handleDownload(response.interactiveBookHtml!, 'interactive-book.html')}><Download className="mr-2 h-4 w-4"/>Download HTML</Button></div>
                                </TabsContent>
                            )}
                            
                            {response.flashcards && (
                                <TabsContent value="flashcards" className="mt-4">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[60vh] overflow-y-auto p-2">
                                        {response.flashcards.map((card, i) => <Flashcard key={i} term={card.term} definition={card.definition} />)}
                                    </div>
                                    <div className="flex justify-end mt-2 gap-2"><Button variant="outline" size="sm" onClick={handleShare}><Share2 className="mr-2 h-4 w-4"/>Share</Button></div>
                                </TabsContent>
                            )}

                            {response.powerpointOutline && (
                                <TabsContent value="powerpointOutline" className="mt-4">
                                    <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-[60vh] overflow-y-auto">
                                        {response.powerpointOutline.slides.map((slide, i) => (
                                            `<h3 key=${i}>Slide ${i+1}: ${slide.title}</h3><ul>${slide.bulletPoints.map(p => `<li key=${p}>${p}</li>`).join('')}</ul>`
                                        )).join('').replace(/<h3/g, '\n<h3')}
                                    </div>
                                    <div className="flex justify-end mt-2 gap-2"><Button variant="outline" size="sm" onClick={handleShare}><Share2 className="mr-2 h-4 w-4"/>Share</Button><Button variant="outline" size="sm" onClick={() => handleCopy(response.powerpointOutline!.slides.map((s,i) => `Slide ${i+1}: ${s.title}\n` + s.bulletPoints.map(p => `- ${p}`).join('\n')).join('\n\n'))}><Copy className="mr-2 h-4 w-4"/>Copy Outline</Button></div>
                                </TabsContent>
                            )}

                            {response.summaryPdfContent && (
                                <TabsContent value="summaryPdfContent" className="mt-4">
                                    <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-[60vh] overflow-y-auto">{response.summaryPdfContent}</div>
                                    <div className="flex justify-end mt-2 gap-2"><Button variant="outline" size="sm" onClick={handleShare}><Share2 className="mr-2 h-4 w-4"/>Share</Button><Button variant="outline" size="sm" onClick={() => handleDownload(response.summaryPdfContent!, 'study-guide.md')}><Download className="mr-2 h-4 w-4"/>Download MD</Button></div>
                                </TabsContent>
                            )}
                        </Tabs>
                    </CardContent>
                     <CardFooter className="flex-col md:flex-row gap-4 justify-between items-center border-t pt-6">
                        <p className="text-sm font-semibold">Integrate with your drives:</p>
                        <div className="flex gap-2">
                             <Button variant="outline" onClick={() => handleDriveConnect('Google')}><LinkIcon className="mr-2 h-4 w-4"/> Connect Google Drive</Button>
                            <Button variant="outline" onClick={() => handleDriveConnect('Microsoft')}><LinkIcon className="mr-2 h-4 w-4"/> Connect Microsoft Drive</Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
