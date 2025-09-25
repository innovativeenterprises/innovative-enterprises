'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { generateVideo } from '@/ai/flows/video-generator';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Download, Video } from 'lucide-react';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';

const FormSchema = z.object({
  prompt: z.string().min(10, 'Please enter a more descriptive prompt (at least 10 characters).'),
});
type FormValues = z.infer<typeof FormSchema>;

export default function VideoGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setVideoUrl(null);
    toast({ title: "Generating Video...", description: "VEO is rendering your video. This may take up to a minute." });
    try {
      const result = await generateVideo({ prompt: data.prompt });
      setVideoUrl(result.videoDataUri);
      toast({ title: "Video Generated!", description: "Your new video is ready to play." });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Video',
        description: 'Failed to generate video. The model may be busy or the request may have timed out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'innovative-enterprises-generated-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Downloaded!", description: "The video has been downloaded." });
  }

  return (
     <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Video className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">VEO Video Factory</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Turn your ideas into motion. Describe a scene, and our AI will generate a short video clip for you.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Create a Video</CardTitle>
                <CardDescription>Describe the video you want to create in detail. The more specific you are, the better the result.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prompt</FormLabel>
                            <FormControl>
                            <VoiceEnabledTextarea
                                placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
                                rows={5}
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base" size="lg">
                        {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                        ) : (
                        <><Sparkles className="mr-2 h-4 w-4" /> Generate Video</>
                        )}
                    </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>

            {isLoading && (
                <Card>
                <CardContent className="p-6 text-center space-y-4">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">The VEO model is rendering your video now...</p>
                    <p className="text-sm text-muted-foreground/80">This process can take up to a minute. Please be patient.</p>
                </CardContent>
                </Card>
            )}

            {videoUrl && (
                <Card>
                <CardHeader>
                    <CardTitle>Your Generated Video</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                        <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain bg-black" />
                    </div>
                </CardContent>
                <CardFooter className="justify-end">
                    <Button onClick={handleDownload} variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Download Video
                    </Button>
                </CardFooter>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}