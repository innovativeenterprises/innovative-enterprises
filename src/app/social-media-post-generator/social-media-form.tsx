

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateSocialMediaPost } from '@/ai/flows/social-media-post-generator';
import { GenerateSocialMediaPostInputSchema, type GenerateSocialMediaPostOutput, type GeneratedPost } from '@/ai/flows/social-media-post-generator.schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy, Megaphone, Image as ImageIcon, Download, Twitter, Linkedin, FacebookIcon, Send, FileText, MessageSquare, Mic, CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


const platformOptions = [
    { id: "LinkedIn", label: "LinkedIn", icon: Linkedin },
    { id: "Twitter", label: "Twitter / X", icon: Twitter },
    { id: "Facebook", label: "Facebook", icon: FacebookIcon },
    { id: "Instagram", label: "Instagram", icon: ImageIcon },
    { id: "WhatsApp", label: "WhatsApp", icon: MessageSquare },
] as const;

const FormSchema = GenerateSocialMediaPostInputSchema.extend({
    postDate: z.date().optional(),
});
type FormValues = z.infer<typeof FormSchema>;

interface ScheduledPost extends GenerateSocialMediaPostOutput {
    topic: string;
    date: Date;
}

const PostDetailDialog = ({ post }: { post: ScheduledPost }) => {
    const { toast } = useToast();
    const [isPublishing, setIsPublishing] = useState<string | null>(null);

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
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle>Campaign Details</DialogTitle>
                <DialogDescription>
                    Review the generated content for your campaign: "{post.topic}" scheduled for {format(post.date, "PPP")}.
                </DialogDescription>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6 pt-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="space-y-4">
                    <h3 className="font-semibold">Generated Image</h3>
                     {post.imageUrl ? (
                        <div className="relative aspect-square w-full overflow-hidden rounded-md border">
                            <Image src={post.imageUrl} alt="Generated for social media post" fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="aspect-square w-full rounded-md border bg-muted flex items-center justify-center">
                            <p className="text-sm text-muted-foreground">No image generated for this post.</p>
                        </div>
                    )}
                </div>
                 <Tabs defaultValue={post.posts[0]?.platform} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                         {post.posts.map(p => (
                            <TabsTrigger key={p.platform} value={p.platform}>
                                {p.platform}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {post.posts.map(p => (
                        <TabsContent key={p.platform} value={p.platform}>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="prose prose-sm max-w-full text-foreground whitespace-pre-wrap h-64 overflow-y-auto">
                                        <p>{p.postContent}</p>
                                        <p className="font-semibold">{p.suggestedHashtags.join(' ')}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end gap-2">
                                     <Button variant="ghost" onClick={() => handleCopy(p.postContent, p.suggestedHashtags)}><Copy className="mr-2 h-4 w-4"/> Copy</Button>
                                    <Button onClick={() => handlePublish(p.platform)} disabled={!!isPublishing}>
                                        {isPublishing === p.platform ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4" />}
                                        Publish
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </DialogContent>
    )
}

const PostCalendarCard = ({ post }: { post: ScheduledPost }) => {
    const platform = post.posts[0]?.platform;
    const PlatformIcon = platformOptions.find(p => p.id === platform)?.icon || FileText;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                            <PlatformIcon className="h-5 w-5 text-muted-foreground" />
                            <p className="text-sm font-semibold truncate flex-1">{post.topic}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.posts[0]?.postContent}</p>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <PostDetailDialog post={post} />
        </Dialog>
    );
};

export default function SocialMediaForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<ScheduledPost[]>([]);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: '',
      platforms: ['LinkedIn'],
      tone: 'Professional',
      generateImage: false,
      postDate: new Date(),
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
      const result = await generateSocialMediaPost(data);
       if (data.postDate) {
           const newPost: ScheduledPost = { ...result, topic: data.topic, date: data.postDate };
           setGeneratedPosts(prev => [...prev, newPost].sort((a, b) => a.date.getTime() - b.date.getTime()));
       }
       toast({ title: "Campaign Generated!", description: "Your new posts are ready for review in the calendar." });
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

  const postsByDate = useMemo(() => {
      return generatedPosts.reduce((acc, post) => {
          const dateStr = format(post.date, 'yyyy-MM-dd');
          if (!acc[dateStr]) {
              acc[dateStr] = [];
          }
          acc[dateStr].push(post);
          return acc;
      }, {} as Record<string, ScheduledPost[]>);
  }, [generatedPosts]);

  const dates = Object.keys(postsByDate).sort();


  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2">
        <Card>
            <CardHeader>
            <CardTitle>Content Composer</CardTitle>
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
                        <VoiceEnabledTextarea
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
                                className="flex flex-row items-start space-x-3 space-y-0"
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
                            <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                            <SelectItem value="Casual">Casual</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="postDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Schedule Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                    >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
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
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Generate Image</FormLabel>
                                <FormDescription>
                                    Let the AI generate a relevant image for your campaign.
                                </FormDescription>
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
                        Generate & Schedule Campaign
                    </>
                    )}
                </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-3">
         <Card>
            <CardHeader>
                <CardTitle>Content Calendar</CardTitle>
                <CardDescription>A view of your scheduled and generated content.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="text-center p-8">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Mira is crafting your content...</p>
                    </div>
                )}
                 {dates.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Your calendar is empty.</p>
                        <p>Generate some content to see it here.</p>
                    </div>
                )}
                <div className="space-y-6">
                    {dates.map(date => (
                        <div key={date}>
                            <h3 className="font-semibold text-primary mb-2">{format(new Date(date), "EEEE, MMMM do")}</h3>
                            <div className="space-y-2">
                                {postsByDate[date].map((post, index) => (
                                    <PostCalendarCard key={index} post={post} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
