
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateSocialMediaPost } from '@/ai/flows/social-media-post-generator';
import { GenerateSocialMediaPostInputSchema, type GenerateSocialMediaPostOutput, type GenerateSocialMediaPostInput, type GeneratedPost } from '@/ai/flows/social-media-post-generator.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy, Megaphone, Image as ImageIcon, Download, Twitter, Linkedin, FacebookIcon, Send } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const platformOptions = [
    { id: "LinkedIn", label: "LinkedIn", icon: Linkedin },
    { id: "Twitter", label: "Twitter / X", icon: Twitter },
    { id: "Facebook", label: "Facebook", icon: FacebookIcon },
    { id: "Instagram", label: "Instagram", icon: ImageIcon },
    { id: "WhatsApp", label: "WhatsApp", icon: MessageSquare },
    { id: "Tender Response", label: "Tender Response", icon: FileText },
] as const;


export default function SocialMediaForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [response, setResponse] = useState<GenerateSocialMediaPostOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<GenerateSocialMediaPostInput>({
    resolver: zodResolver(GenerateSocialMediaPostInputSchema),
    defaultValues: {
      topic: '',
      platforms: ['LinkedIn'],
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

  const handleCopy = (content: string, hashtags: string[]) => {
    const fullText = `${content}\n\n${hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    toast({ title: "Copied!", description: "The post content has been copied to your clipboard." });
  };
  
  const handlePublish = (platform: string) => {
      setIsPublishing(platform);
      toast({ title: 'Publishing...', description: `Sending post to ${platform}.`});
      // Simulate API call
      setTimeout(() => {
          setIsPublishing(null);
          toast({ title: 'Published Successfully!', description: `Your post is now live on ${platform}.`});
      }, 2000);
  }


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate a Social Media Campaign</CardTitle>
          <CardDescription>Describe your topic, select your target platforms, and Mira will craft a tailored post for each one.</CardDescription>
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
                        placeholder="e.g., Announce a new partnership with a major tech company."
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
                name="platforms"
                render={() => (
                  <FormItem>
                    <div>
                        <FormLabel>Target Platforms</FormLabel>
                        <FormDescription>Select one or more platforms for your campaign.</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                    {platformOptions.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="platforms"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center gap-2">
                                <item.icon className="h-4 w-4" /> {item.label}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                 <FormField
                  control={form.control}
                  name="generateImage"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm h-fit mt-auto">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Generate a campaign image
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Campaign
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

      {response && response.posts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Megaphone className="h-6 w-6" /> Generated Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             {response.imageUrl && (
                <div>
                     <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><ImageIcon className="h-5 w-5" /> Generated Campaign Image</h3>
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                         <Image src={response.imageUrl} alt="Generated for social media post" layout="fill" objectFit="cover" />
                    </div>
                     <div className="flex justify-end mt-2">
                        <Button onClick={handleDownloadImage} variant="outline"><Download className="mr-2 h-4 w-4"/> Download Image</Button>
                    </div>
                </div>
            )}
             <Tabs defaultValue={response.posts[0].platform} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    {response.posts.map(p => <TabsTrigger key={p.platform} value={p.platform}>{p.platform}</TabsTrigger>)}
                </TabsList>
                {response.posts.map(post => (
                    <TabsContent key={post.platform} value={post.platform}>
                         <div className="relative">
                            <div className="prose prose-sm max-w-full rounded-md border bg-muted p-4 whitespace-pre-wrap h-96 overflow-y-auto">
                                <p>{post.postContent}</p>
                                {post.suggestedHashtags && post.suggestedHashtags.length > 0 && (
                                <p className="font-semibold">{post.suggestedHashtags.join(' ')}</p>
                                )}
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground h-8 w-8"
                                    onClick={() => handleCopy(post.postContent, post.suggestedHashtags)}
                                    >
                                    <Copy className="h-4 w-4" />
                                </Button>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground h-8 w-8"
                                    onClick={() => handlePublish(post.platform)}
                                    disabled={isPublishing !== null}
                                    >
                                     {isPublishing === post.platform ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
