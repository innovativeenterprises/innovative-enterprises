
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateSocialMediaPost } from '@/ai/flows/social-media-post-generator';
import { GenerateSocialMediaPostInputSchema, type GenerateSocialMediaPostOutput, type GenerateSocialMediaPostInput } from '@/ai/flows/social-media-post-generator.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy, Megaphone, Image as ImageIcon, Download, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

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
      generateImage: false,
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
        description: 'Failed to generate content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (!response?.imageUrl) return;
    const link = document.createElement('a');
    link.href = response.imageUrl;
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Downloaded!", description: "The image has been downloaded." });
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate Content</CardTitle>
          <CardDescription>Fill in the details below to generate marketing copy, a social post, or a tender response draft.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic / Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Announce a new partnership with a major tech company. / Write a draft response for Tender #123, focusing on our AI capabilities."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type / Platform</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Tender Response">Tender Response</SelectItem>
                          <SelectItem value="LinkedIn">LinkedIn Post</SelectItem>
                          <SelectItem value="Twitter">Twitter Post</SelectItem>
                          <SelectItem value="Facebook">Facebook Post</SelectItem>
                          <SelectItem value="Instagram">Instagram Post</SelectItem>
                          <SelectItem value="WhatsApp">WhatsApp Message</SelectItem>
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

               <FormField
                  control={form.control}
                  name="generateImage"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Generate an image for the post (for social media)
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
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
                <p className="mt-4 text-muted-foreground">Mira is crafting your content... This may take a moment.</p>
            </CardContent>
         </Card>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Megaphone className="h-6 w-6" /> Generated Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
                <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-96 overflow-y-auto">
                    <p>{response.postContent}</p>
                    {response.suggestedHashtags && response.suggestedHashtags.length > 0 && (
                      <p className="font-semibold">{response.suggestedHashtags.join(' ')}</p>
                    )}
                </div>
              <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-muted-foreground"
                  onClick={() => {
                    navigator.clipboard.writeText(response.postContent + '\n\n' + (response.suggestedHashtags?.join(' ') || ''));
                    toast({ title: "Copied!", description: "The content has been copied to your clipboard." });
                  }}
                >
                  <Copy className="h-5 w-5" />
              </Button>
            </div>
             {response.imageUrl && (
                <div>
                     <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><ImageIcon className="h-5 w-5" /> Generated Image</h3>
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                         <Image src={response.imageUrl} alt="Generated for social media post" layout="fill" objectFit="cover" />
                    </div>
                     <div className="flex justify-end mt-2">
                        <Button onClick={handleDownloadImage} variant="outline"><Download className="mr-2 h-4 w-4"/> Download Image</Button>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
