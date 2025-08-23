'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateSocialMediaPost, GenerateSocialMediaPostInputSchema, type GenerateSocialMediaPostOutput, type GenerateSocialMediaPostInput } from '@/ai/flows/social-media-post-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy, ThumbsUp, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';


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
                    {platformIcons[form.getValues('platform')]}
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
          </CardContent>
        </Card>
      )}
    </>
  );
}
