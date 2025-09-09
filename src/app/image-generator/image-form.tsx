
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateImage } from '@/ai/flows/image-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Download, Image as ImageIcon, Mic } from 'lucide-react';
import Image from 'next/image';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';

const FormSchema = z.object({
  prompt: z.string().min(10, 'Please enter a more descriptive prompt (at least 10 characters).'),
});
type FormValues = z.infer<typeof FormSchema>;

export default function ImageForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setImageUrl(null);
    try {
      const result = await generateImage({ prompt: data.prompt });
      setImageUrl(result.imageUrl);
      toast({ title: "Image Generated!", description: "Your new image is ready." });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate image. The model may be unavailable. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'innovative-enterprises-generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Downloaded!", description: "The image has been downloaded." });
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create an Image</CardTitle>
          <CardDescription>Describe the image you want to create in detail.</CardDescription>
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
                        placeholder="e.g., A photorealistic image of a futuristic city in the Omani desert at sunset, with flying vehicles and glowing buildings."
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
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate Image</>
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
            <p className="text-muted-foreground">Lina is creating your image now...</p>
            <p className="text-sm text-muted-foreground/80">This can sometimes take up to 30 seconds. Please be patient.</p>
          </CardContent>
        </Card>
      )}

      {imageUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Your Generated Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full overflow-hidden rounded-md border">
              <Image src={imageUrl} alt={form.getValues('prompt')} layout="fill" objectFit="cover" />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handleDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Download Image
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
