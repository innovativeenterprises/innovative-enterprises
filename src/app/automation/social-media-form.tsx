'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateSocialMediaPost } from '@/ai/flows/social-media-post-generator';
import { GenerateSocialMediaPostInputSchema, type GenerateSocialMediaPostOutput, type GenerateSocialMediaPostInput } from '@/ai/flows/social-media-post-generator.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy, ThumbsUp, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}>
        <path
          fill="currentColor"
          d="M19.05 4.94A9.96 9.96 0 0 0 12 2a10 10 0 0 0-10 10c0 2.45.88 4.7 2.37 6.44L2.05 22l3.58-2.05A9.96 9.96 0 0 0 12 22a10 10 0 0 0 10-10c0-2.76-1.12-5.26-2.95-7.06m-7.07 15.28c-1.97 0-3.8-1.02-5.14-2.61L6 16.88l-2.52 1.45l.95-2.8l-.33-.56A8.14 8.14 0 0 1 4 12a8 8 0 0 1 8-8c2.15 0 4.14.84 5.66 2.34c1.52 1.52 2.34 3.51 2.34 5.66c0 4.42-3.58 8-8 8m4.49-6.19c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.18-.54.06c-.25-.12-1.07-.39-2.04-1.26c-.76-.66-1.27-1.47-1.42-1.72c-.14-.25-.01-.38.11-.5c.11-.11.25-.29.37-.43s.17-.25.25-.42c.08-.17.04-.31-.02-.43c-.06-.12-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07c0 1.22.88 2.4 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.26 1.05.41 1.41.52c.59.18 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18c-.05-.12-.19-.18-.42-.31"
        />
      </svg>
    );
}

export default function SocialMediaForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GenerateSocialMediaPostOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<GenerateSocialMediaPostInput>({
    resolver: zodResolver(GenerateSocialMediaPostInputSchema),
    defaultValues: {
      topic: '',
      platform: 'LinkedIn',
      tone: 'Professional',
    },
  });

  const onSubmit: SubmitHandler<GenerateSocialMediaPostInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
        const result = await generateSocialMediaPost(data);
        setResponse(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate social media post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const platformIcons = {
      Twitter: <Twitter className="h-4 w-4" />,
      LinkedIn: <Linkedin className="h-4 w-4" />,
      Facebook: <Facebook className="h-4 w-4" />,
      Instagram: <Instagram className="h-4 w-4" />,
      WhatsApp: <WhatsAppIcon className="h-4 w-4" />,
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Social Media Post Generator</CardTitle>
          <CardDescription>Create engaging social media posts in seconds.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic / Idea</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., The future of AI in Oman's Vision 2040"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
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
                            <SelectItem value="Twitter">Twitter</SelectItem>
                            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                            <SelectItem value="Facebook">Facebook</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
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
                            <SelectItem value="Casual">Casual</SelectItem>
                            <SelectItem value="Witty">Witty</SelectItem>
                            <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
               </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Post...
                  </>
                ) : (
                   <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Post
                   </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <Card className="mt-8">
            <CardContent className="p-6 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Our AI is crafting the perfect post for you...</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card className="mt-8">
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>Generated Post</CardTitle>
                    <CardDescription>
                        Here's your AI-generated post for {form.getValues('platform')}.
                    </CardDescription>
                </div>
                 <div className="flex items-center gap-2 text-muted-foreground">
                    {platformIcons[form.getValues('platform') as keyof typeof platformIcons]}
                    <span className="text-sm font-medium">{form.getValues('platform')}</span>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Textarea
                readOnly
                value={response.postContent}
                rows={8}
                className="bg-muted pr-12"
              />
              <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-muted-foreground"
                  onClick={() => {
                    navigator.clipboard.writeText(response.postContent);
                    toast({ title: "Copied!", description: "Post content copied to clipboard." });
                  }}
                >
                  <Copy className="h-5 w-5" />
              </Button>
            </div>
             {response.suggestedHashtags.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-primary" />
                        Suggested Hashtags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {response.suggestedHashtags.map(tag => (
                            <Badge 
                                key={tag} 
                                variant="secondary" 
                                className="cursor-pointer hover:bg-primary/20"
                                onClick={() => {
                                    navigator.clipboard.writeText(tag);
                                    toast({ title: "Copied!", description: `${tag} copied to clipboard.` });
                                }}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
             )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
