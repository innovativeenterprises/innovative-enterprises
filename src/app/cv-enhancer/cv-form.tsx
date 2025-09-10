

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeCv, generateEnhancedCv } from '@/ai/flows/cv-enhancement';
import { type CvAnalysisOutput, type CvGenerationOutput } from '@/ai/flows/cv-enhancement.schema';
import { generateSocialMediaPost } from '@/ai/flows/social-media-post-generator';
import { type GenerateSocialMediaPostOutput, GenerateSocialMediaPostInputSchema } from '@/ai/flows/social-media-post-generator.schema';
import { generateInterviewQuestions } from '@/ai/flows/interview-coach';
import type { InterviewQuestion } from '@/ai/flows/interview-coach.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, CheckCircle, XCircle, ChevronDown, ChevronUp, Download, Copy, Mail, Bot, Megaphone, Smile, ArrowRight, Lock, Briefcase, FileText, Languages } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import InterviewCoachForm from '@/app/interview-coach/coach-form';
import Link from 'next/link';
import { fileToDataURI } from '@/lib/utils';

const availableLanguages = [
    { id: 'english', label: 'English' },
    { id: 'arabic', label: 'Arabic' },
    { id: 'french', label: 'French' },
    { id: 'spanish', label: 'Spanish' },
] as const;

// Step 1: Initial CV Upload
const UploadSchema = z.object({
  cvDocument: z.any().refine(file => file?.length == 1, 'CV document is required.'),
});
type UploadValues = z.infer<typeof UploadSchema>;

// Step 2: Generation Details
const GenerationSchema = z.object({
    targetPosition: z.string().min(3, "Target position is required."),
    jobAdvertisement: z.string().optional(),
    languages: z.array(z.string()).refine(value => value.some(item => item), {
        message: "You have to select at least one language.",
    }),
});
type GenerationValues = z.infer<typeof GenerationSchema>;

interface Selection {
    cv: boolean;
    coverLetter: boolean;
    languages: string[];
}

const SuggestionSection = ({ title, data }: { title: string; data: { isCompliant: boolean; suggestions: string[] } }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="border rounded-lg p-4">
                <CollapsibleTrigger asChild>
                  <div className="flex justify-between items-center w-full cursor-pointer">
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
                      <div className="p-1 rounded-md hover:bg-accent">
                          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          <span className="sr-only">Toggle</span>
                      </div>
                  </div>
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

const SocialPostDialog = ({ 
    targetPosition, 
    onGenerate,
    beforeScore,
    afterScore,
}: { 
    targetPosition: string, 
    onGenerate: (output: GenerateSocialMediaPostOutput) => void,
    beforeScore?: number,
    afterScore?: number,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const socialForm = useForm<z.infer<typeof GenerateSocialMediaPostInputSchema>>({
        resolver: zodResolver(GenerateSocialMediaPostInputSchema),
        defaultValues: {
            topic: `I just enhanced my CV for a ${targetPosition} role using Innovative Enterprises' AI tool! Check it out.`,
            platforms: ['LinkedIn'],
            tone: "Professional",
            generateImage: true,
            promotionUrl: "https://innovative.om/genius"
        }
    });

    const handleSocialPost: SubmitHandler<z.infer<typeof GenerateSocialMediaPostInputSchema>> = async (data) => {
        setIsLoading(true);
        try {
            const result = await generateSocialMediaPost({...data, beforeScore, afterScore});
            onGenerate(result);
        } catch (error) {
             toast({
                title: 'Error generating social post',
                description: 'Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><Megaphone className="mr-2 h-4 w-4" /> Generate Social Post</Button>
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
                            name="platforms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Platform</FormLabel>
                                    <Select onValueChange={(v) => field.onChange([v])} defaultValue={field.value[0]}>
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
                        <FormField
                            control={socialForm.control}
                            name="generateImage"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>Generate an image for the post</FormLabel>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                             <DialogClose asChild>
                                 <Button type="button" variant="ghost">Cancel</Button>
                             </DialogClose>
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

const SelectionMatrix = ({ 
    requestedLanguages, 
    selections, 
    onSelectionChange,
    price,
    onUnlock,
}: {
    requestedLanguages: string[],
    selections: Selection,
    onSelectionChange: (newSelection: Selection) => void,
    price: number,
    onUnlock: () => void,
}) => {
    
    const handleDocTypeChange = (type: 'cv' | 'coverLetter', checked: boolean) => {
        onSelectionChange({ ...selections, [type]: checked });
    }

    const handleLanguageChange = (language: string, checked: boolean) => {
        const newLanguages = checked 
            ? [...selections.languages, language]
            : selections.languages.filter(l => l !== language);
        onSelectionChange({ ...selections, languages: newLanguages });
    }

    return (
        <div className="space-y-6 p-6 border-t">
            <div className="text-center">
                <h3 className="font-semibold text-lg text-primary">Customize Your Package</h3>
                <p className="text-muted-foreground text-sm">Select the documents and languages you want to generate.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><FileText /> Document Types</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="cv" checked={selections.cv} onCheckedChange={(c) => handleDocTypeChange('cv', !!c)} />
                            <Label htmlFor="cv" className="font-medium">Enhanced CV</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="coverLetter" checked={selections.coverLetter} onCheckedChange={(c) => handleDocTypeChange('coverLetter', !!c)} />
                            <Label htmlFor="coverLetter" className="font-medium">Tailored Cover Letter</Label>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><Languages /> Languages</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {requestedLanguages.map(lang => (
                            <div key={lang} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`lang-${lang}`}
                                    checked={selections.languages.includes(lang)}
                                    onCheckedChange={(c) => handleLanguageChange(lang, !!c)}
                                />
                                <Label htmlFor={`lang-${lang}`} className="font-medium capitalize">{lang}</Label>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-muted/50">
                <CardContent className="p-4 flex flex-col items-center justify-center gap-4">
                    <div className="text-center">
                        <p className="text-muted-foreground">Total Price</p>
                        <p className="text-4xl font-bold text-primary">OMR {price.toFixed(2)}</p>
                    </div>
                     <Button onClick={onUnlock} className="w-full max-w-xs bg-accent hover:bg-accent/90" size="lg" disabled={price === 0}>
                        <Lock className="mr-2 h-4 w-4" /> Unlock & Download for OMR {price.toFixed(2)}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

const FinalActions = ({ onDownload, onCopy, onEmail, onSave }: { 
    onDownload: () => void, 
    onCopy: () => void, 
    onEmail: () => void, 
    onSave: () => void, 
}) => {
    return (
         <div className="flex justify-between items-center w-full">
            <Button variant="outline" onClick={onSave} disabled><Briefcase className="mr-2 h-4 w-4"/> Save to E-Briefcase</Button>
            <div className="flex gap-2">
                <Button variant="outline" onClick={onDownload}><Download className="mr-2 h-4 w-4"/> Download</Button>
                <Button variant="outline" onClick={onCopy}><Copy className="mr-2 h-4 w-4"/> Copy</Button>
                <Button onClick={onEmail}><Mail className="mr-2 h-4 w-4"/> Email</Button>
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
  const [requestedLanguages, setRequestedLanguages] = useState<string[]>([]);

  const [selections, setSelections] = useState<Selection>({
      cv: true,
      coverLetter: true,
      languages: [],
  });

  const { toast } = useToast();

  const uploadForm = useForm<UploadValues>({
    resolver: zodResolver(UploadSchema),
  });

  const generationForm = useForm<GenerationValues>({
    resolver: zodResolver(GenerationSchema),
    defaultValues: {
      targetPosition: '',
      jobAdvertisement: '',
      languages: ["english"],
    },
  });

  const price = useMemo(() => {
    const CV_PRICE = 4;
    const COVER_LETTER_PRICE = 2;
    const LANG_MULTIPLIER = 1; // Price is per language

    let total = 0;
    const numLanguages = selections.languages.length;

    if (numLanguages === 0) return 0;

    if (selections.cv) {
        total += CV_PRICE;
    }
    if (selections.coverLetter) {
        total += COVER_LETTER_PRICE;
    }

    return total * numLanguages * LANG_MULTIPLIER;
  }, [selections]);

  const handleAnalysis: SubmitHandler<UploadValues> = async (data) => {
    setIsLoading(true);
    setAnalysis(null);
    setGeneratedCv(null);
    setIsUnlocked(false);
    setSocialPost(null);
    setRequestedLanguages([]);
    try {
        const file = data.cvDocument[0];
        const uri = await fileToDataURI(file);
        setCvDataUri(uri);
        const result = await analyzeCv({ cvDataUri: uri });
        setAnalysis(result);
    } catch (error) {
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

    const languages = data.languages.map(l => l.trim().toLowerCase()).filter(Boolean);
    setRequestedLanguages(languages);
    setSelections({ cv: true, coverLetter: true, languages: languages.slice(0,1) });


    try {
        const result = await generateEnhancedCv({ 
            cvDataUri,
            targetPosition: data.targetPosition,
            jobAdvertisement: data.jobAdvertisement,
            languages: languages,
        });
        setGeneratedCv(result);
    } catch (error) {
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
    if (price <= 0) {
        toast({
            title: 'No items selected',
            description: 'Please select at least one document and language.',
            variant: 'destructive',
        });
        return;
    }
    // Simulate payment
    toast({
        title: 'Payment processing...',
        description: `Processing payment of OMR ${price.toFixed(2)}`,
    });

    setTimeout(() => {
        setIsUnlocked(true);
        toast({
            title: 'Success!',
            description: 'Your documents have been unlocked.',
        });
    }, 1500)
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
                            render={() => (
                            <FormItem>
                                <div className="mb-4">
                                     <FormLabel>Languages for CV & Cover Letter</FormLabel>
                                     <FormDescription>Select all languages you require.</FormDescription>
                                </div>
                                {availableLanguages.map((item) => (
                                    <FormField
                                    key={item.id}
                                    control={generationForm.control}
                                    name="languages"
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
                    <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
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
                     <CardDescription>Your CV and Cover Letter are now highly optimized. The next step is to prepare for the interview.</CardDescription>
                       <Button asChild variant="secondary" className="mt-2">
                        <Link href="/interview-coach" scroll={false}>Practice for Interview <ArrowRight className="ml-2 h-4 w-4"/></Link>
                      </Button>
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
                        <TabsTrigger value="cv" disabled={!isUnlocked}>Enhanced CV</TabsTrigger>
                        <TabsTrigger value="letter" disabled={!isUnlocked}>Cover Letter</TabsTrigger>
                    </TabsList>
                    <TabsContent value="cv">
                        <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-96 overflow-y-auto">
                            {isUnlocked ? generatedCv.newCvContent : "Unlock to view your enhanced CV."}
                        </div>
                    </TabsContent>
                    <TabsContent value="letter">
                         <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-96 overflow-y-auto">
                             {isUnlocked ? generatedCv.newCoverLetterContent : "Unlock to view your cover letter."}
                        </div>
                    </TabsContent>
                </Tabs>

                {socialPost && (
                    <div className="mt-6">
                        <h4 className="font-semibold text-lg">Your Generated Social Media Post:</h4>
                         {socialPost.imageUrl && (
                            <div className="relative aspect-video w-full my-4 rounded-md overflow-hidden border">
                                <img src={socialPost.imageUrl} alt="Social media post" className="object-cover w-full h-full"/>
                            </div>
                        )}
                        <div className="mt-2 prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap">
                            <p>{socialPost.posts[0].postContent}</p>
                            <p className="font-semibold">{socialPost.posts[0].suggestedHashtags.join(' ')}</p>
                        </div>
                        <div className="flex justify-end mt-2">
                            <Button variant="ghost" onClick={() => { 
                                navigator.clipboard.writeText(socialPost.posts[0].postContent + '\n\n' + socialPost.posts[0].suggestedHashtags.join(' '));
                                toast({ title: 'Copied!', description: 'Social post content copied to clipboard.'});
                            }}>
                                <Copy className="mr-2 h-4 w-4" /> Copy Post
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-4 p-0">
                 {!isUnlocked ? (
                    <SelectionMatrix 
                        requestedLanguages={requestedLanguages}
                        selections={selections}
                        onSelectionChange={setSelections}
                        price={price}
                        onUnlock={handleUnlock}
                    />
                 ) : (
                    <div className="p-6 w-full space-y-4">
                        <SocialPostDialog 
                            targetPosition={targetPosition}
                            onGenerate={handleGeneratedSocialPost}
                            beforeScore={analysis.overallScore}
                            afterScore={generatedCv.newOverallScore}
                        />
                        <FinalActions 
                            onDownload={handleDownload}
                            onCopy={handleCopy}
                            onEmail={handleEmail}
                            onSave={() => {}}
                        />
                    </div>
                 )}
            </CardFooter>
         </Card>
      )}
    </div>
  );
}
