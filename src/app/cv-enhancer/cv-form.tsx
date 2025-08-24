'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeCv, generateEnhancedCv } from '@/ai/flows/cv-enhancement';
import { type CvAnalysisOutput, type CvGenerationOutput } from '@/ai/flows/cv-enhancement.schema';
import { generateSocialMediaPost } from '@/ai/flows/social-media-post-generator';
import { type GenerateSocialMediaPostOutput, GenerateSocialMediaPostInputSchema } from '@/ai/flows/social-media-post-generator.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, XCircle, ChevronDown, ChevronUp, Download, Copy, Mail, Bot, Megaphone, Smile, ArrowRight, Lock, Briefcase } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Step 1: Initial CV Upload
const UploadSchema = z.object({
  cvDocument: z.any().refine(file => file?.length == 1, 'CV document is required.'),
});
type UploadValues = z.infer<typeof UploadSchema>;

// Step 2: Generation Details
const GenerationSchema = z.object({
    targetPosition: z.string().min(3, "Target position is required."),
    jobAdvertisement: z.string().optional(),
    languages: z.string().min(2, "Language is required."),
});
type GenerationValues = z.infer<typeof GenerationSchema>;


const SuggestionSection = ({ title, data }: { title: string; data: { isCompliant: boolean; suggestions: string[] } }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="border rounded-lg p-4">
                <CollapsibleTrigger className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                        {data.isCompliant ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <h4 className="font-semibold">{title}</h4>
                        <Badge variant={data.isCompliant ? "default" : "destructive"}>
                            {data.isCompliant ? "Compliant" : "Needs Improvement"}
                        </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <ul className="list-disc pl-8 mt-2 space-y-1 text-sm text-muted-foreground">
                        {data.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </CollapsibleContent>
            </div>
        </Collapsible>
    )
}

const SocialPostDialog = ({ targetPosition, onGenerate }: { targetPosition: string, onGenerate: (output: GenerateSocialMediaPostOutput) => void }) => {
    const [isLoading, setIsLoading] = useState(false);

    const socialForm = useForm({
        resolver: zodResolver(GenerateSocialMediaPostInputSchema),
        defaultValues: {
            topic: `I just enhanced my CV for a ${targetPosition} role using Innovative Enterprises' AI tool!`,
            platform: "LinkedIn" as const,
            tone: "Professional" as const,
        }
    });

    const handleSocialPost: SubmitHandler<any> = async (data) => {
        setIsLoading(true);
        try {
            const result = await generateSocialMediaPost(data);
            onGenerate(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><Megaphone className="mr-2" /> Generate Social Post</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Social Media Post</DialogTitle>
                    <DialogDescription>
                        Create a social media post to announce your new and improved CV.
                    </DialogDescription>
                </DialogHeader>
                <Form {...socialForm}>
                    <form onSubmit={socialForm.handleSubmit(handleSocialPost)} className="space-y-4">
                        <FormField
                            control={socialForm.control}
                            name="topic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Post Topic</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={socialForm.control}
                            name="platform"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Platform</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a platform" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                            <SelectItem value="Twitter">Twitter</SelectItem>
                                            <SelectItem value="Facebook">Facebook</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={socialForm.control}
                            name="tone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tone</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a tone" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Professional">Professional</SelectItem>
                                            <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                                            <SelectItem value="Casual">Casual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : 'Generate'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

const GatedActions = ({ onUnlock, onDownload, onCopy, onEmail, onSave, unlocked, activeTabContent, activeTabName }: { 
    onUnlock: () => void, 
    onDownload: () => void, 
    onCopy: () => void, 
    onEmail: () => void, 
    onSave: () => void, 
    unlocked: boolean,
    activeTabContent: string,
    activeTabName: string,
}) => {
    if (!unlocked) {
        return (
            <div className="flex flex-col items-center gap-4 w-full p-6 border-t">
                 <Lock className="w-8 h-8 text-primary" />
                <div className="text-center">
                    <h3 className="font-semibold text-lg">Your Documents are Ready!</h3>
                    <p className="text-muted-foreground text-sm">Pay the service charge to unlock, download, and share your new CV and cover letter.</p>
                </div>
                <Button onClick={onUnlock} className="w-full max-w-xs bg-accent hover:bg-accent/90">
                    Unlock & Download Now
                </Button>
            </div>
        )
    }

    return (
         <div className="flex justify-between items-center w-full">
            <Button variant="outline" disabled><Briefcase className="mr-2"/> Save to E-Briefcase</Button>
            <div className="flex gap-2">
                <Button variant="outline" onClick={onDownload}><Download className="mr-2"/> Download</Button>
                <Button variant="outline" onClick={onCopy}><Copy className="mr-2"/> Copy</Button>
                <Button onClick={onEmail}><Mail className="mr-2"/> Email</Button>
            </div>
        </div>
    )
}

export default function CvForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [cvDataUri, setCvDataUri] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CvAnalysisOutput | null>(null);
  const [generatedCv, setGeneratedCv] = useState<CvGenerationOutput | null>(null);
  const [activeTab, setActiveTab] = useState('cv');
  const [targetPosition, setTargetPosition] = useState('');
  const [socialPost, setSocialPost] = useState<GenerateSocialMediaPostOutput | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const { toast } = useToast();

  const uploadForm = useForm<UploadValues>({
    resolver: zodResolver(UploadSchema),
  });

  const generationForm = useForm<GenerationValues>({
    resolver: zodResolver(GenerationSchema),
  });

  const handleAnalysis: SubmitHandler<UploadValues> = async (data) => {
    setIsLoading(true);
    setAnalysis(null);
    setGeneratedCv(null);
    setIsUnlocked(false);
    setSocialPost(null);
    try {
        const file = data.cvDocument[0];
        const uri = await fileToDataURI(file);
        setCvDataUri(uri);
        const result = await analyzeCv({ cvDataUri: uri });
        setAnalysis(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to analyze CV. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneration: SubmitHandler<GenerationValues> = async (data) => {
    if (!cvDataUri) return;
    setIsGenerating(true);
    setGeneratedCv(null);
    setIsUnlocked(false);
    setSocialPost(null);
    setTargetPosition(data.targetPosition);
    try {
        const result = await generateEnhancedCv({ 
            cvDataUri,
            targetPosition: data.targetPosition,
            jobAdvertisement: data.jobAdvertisement,
            languages: data.languages.split(',').map(l => l.trim()),
        });
        setGeneratedCv(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate enhanced CV. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getContentToShare = () => {
      if (!generatedCv) return "";
      return activeTab === 'cv' ? generatedCv.newCvContent : generatedCv.newCoverLetterContent;
  }

  const handleDownload = () => {
    const content = getContentToShare();
    if (!content) return;
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = activeTab === 'cv' ? "enhanced-cv.txt" : "cover-letter.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({ title: 'Downloaded!', description: `Your new ${activeTab === 'cv' ? 'CV' : 'cover letter'} has been downloaded.`});
  };

  const handleCopy = () => {
    const content = getContentToShare();
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied!', description: `${activeTab === 'cv' ? 'CV' : 'Cover letter'} content copied to clipboard.`});
  };

  const handleEmail = () => {
    const content = getContentToShare();
    if (!content) return;
    const subject = activeTab === 'cv' ? "My Newly Enhanced CV" : "My New Cover Letter";
    const body = encodeURIComponent(content);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  
  const handleUnlock = () => {
    setIsUnlocked(true);
    toast({
        title: 'Success!',
        description: 'Your documents have been unlocked.',
    });
  }

  const handleGeneratedSocialPost = (output: GenerateSocialMediaPostOutput) => {
    setSocialPost(output);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Upload Your CV</CardTitle>
          <CardDescription>Our AI will analyze your CV for ATS compatibility.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...uploadForm}>
            <form onSubmit={uploadForm.handleSubmit(handleAnalysis)} className="space-y-6">
              <FormField
                control={uploadForm.control}
                name="cvDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CV Document (Word, PDF, or Image)</FormLabel>
                    <FormControl>
                        <Input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>
                ) : (
                   <><Sparkles className="mr-2 h-4 w-4" />Analyze My CV</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <Card>
            <CardContent className="p-6 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Our AI is analyzing your CV... This may take a moment.</p>
            </CardContent>
         </Card>
      )}

      {analysis && !generatedCv && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Review Analysis & Enhance</CardTitle>
            <CardDescription>{analysis.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Overall ATS Score</h3>
                <span className="font-bold text-lg text-primary">{analysis.overallScore}/100</span>
              </div>
              <Progress value={analysis.overallScore} className="w-full" />
            </div>

            <div className="space-y-4 pt-4">
                <SuggestionSection title="Contact Information" data={analysis.contactInfo} />
                <SuggestionSection title="Work Experience" data={analysis.workExperience} />
                <SuggestionSection title="Skills Section" data={analysis.skills} />
                <SuggestionSection title="Education" data={analysis.education} />
                <SuggestionSection title="Formatting & Parsing" data={analysis.formatting} />
            </div>
            
            <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4 text-primary">Let's Rebuild Your CV!</h3>
                 <Form {...generationForm}>
                    <form onSubmit={generationForm.handleSubmit(handleGeneration)} className="space-y-6">
                        <FormField
                            control={generationForm.control}
                            name="targetPosition"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>What position are you applying for?</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Senior Software Engineer" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={generationForm.control}
                            name="jobAdvertisement"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Advertisement (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Paste the job description here for a more tailored result." rows={6} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={generationForm.control}
                            name="languages"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Languages (comma-separated)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., English, Arabic" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isGenerating} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                            {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                            ) : (
                            <>
                                <Bot className="mr-2 h-4 w-4" />
                                Create Enhanced Documents
                            </>
                            )}
                        </Button>
                    </form>
                 </Form>
            </div>
          </CardContent>
        </Card>
      )}

      {isGenerating && (
         <Card>
            <CardContent className="p-6 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
                <p className="mt-4 text-muted-foreground">Our AI is crafting your new documents... This is the exciting part!</p>
            </CardContent>
         </Card>
      )}

      {generatedCv && analysis && (
         <Card>
            <CardHeader>
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full animate-bounce">
                        <Smile className="h-12 w-12 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl">Congratulations! Your ATS Score has Improved!</CardTitle>
                    <div className="flex items-center gap-4 text-2xl font-bold">
                        <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                            <span className="text-sm font-medium text-muted-foreground">Original Score</span>
                            <span>{analysis.overallScore}</span>
                        </div>
                        <ArrowRight className="h-8 w-8 text-primary" />
                        <div className="flex flex-col items-center p-4 rounded-lg bg-primary text-primary-foreground">
                            <span className="text-sm font-medium">New Score</span>
                            <span>{generatedCv.newOverallScore}</span>
                        </div>
                    </div>
                     <CardDescription>Your CV and Cover Letter are now highly optimized and ready for the next step.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                 {analysis.overallScore < 100 && generatedCv.newOverallScore < 100 && !isUnlocked && (
                    <Alert variant="default" className="mb-6">
                        <Sparkles className="h-4 w-4" />
                        <AlertTitle>Want an even higher score?</AlertTitle>
                        <AlertDescription>
                            Your score improved, but we can do even better! The AI couldn't find some key details in your original CV. Consider adding more quantifiable achievements, specific skills mentioned in the job ad, or more detailed project descriptions to your CV and try again. Or, proceed with the currently enhanced version.
                        </AlertDescription>
                    </Alert>
                 )}

                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="cv">Enhanced CV</TabsTrigger>
                        <TabsTrigger value="letter">Cover Letter</TabsTrigger>
                    </TabsList>
                    <TabsContent value="cv">
                        <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-96 overflow-y-auto">
                            {generatedCv.newCvContent}
                        </div>
                    </TabsContent>
                    <TabsContent value="letter">
                         <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-96 overflow-y-auto">
                            {generatedCv.newCoverLetterContent}
                        </div>
                    </TabsContent>
                </Tabs>

                {socialPost && (
                    <div className="mt-6">
                        <h4 className="font-semibold text-lg">Your Generated Social Media Post:</h4>
                        <div className="mt-2 prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap">
                            <p>{socialPost.postContent}</p>
                            <p className="font-semibold">{socialPost.suggestedHashtags.join(' ')}</p>
                        </div>
                        <div className="flex justify-end mt-2">
                            <Button variant="ghost" onClick={() => { 
                                navigator.clipboard.writeText(socialPost.postContent + '\n\n' + socialPost.suggestedHashtags.join(' '));
                                toast({ title: 'Copied!', description: 'Social post content copied to clipboard.'});
                            }}>
                                <Copy className="mr-2 h-4 w-4" /> Copy Post
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-4">
                {isUnlocked && <SocialPostDialog targetPosition={targetPosition} onGenerate={handleGeneratedSocialPost} />}
                <GatedActions 
                    unlocked={isUnlocked}
                    onUnlock={handleUnlock}
                    onDownload={handleDownload}
                    onCopy={handleCopy}
                    onEmail={handleEmail}
                    onSave={() => {}}
                    activeTabContent={getContentToShare()}
                    activeTabName={activeTab}
                />
            </CardFooter>
         </Card>
      )}
    </div>
  );
}
