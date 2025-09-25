
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Palette, Wand2 } from 'lucide-react';
import { ThemeGeneratorInputSchema, type ThemeGeneratorInput, type ThemeGeneratorOutput } from '@/ai/flows/theme-generator.schema';
import { generateTheme } from '@/ai/flows/theme-generator';
import { VoiceEnabledTextarea } from '@/components/voice-enabled-textarea';
import { cn } from '@/lib/utils';
import { store } from '@/lib/global-store';

const ColorPreview = ({ title, color, className }: { title: string, color: any, className?: string }) => (
    <div className={cn("p-4 rounded-lg border text-sm", className)}>
        <div className="flex items-center justify-between">
            <p className="font-semibold capitalize">{title}</p>
            <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: color.hex }}></div>
                 <span className="font-mono text-xs">{color.hex}</span>
            </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{color.description}</p>
    </div>
)

export default function ThemeGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ThemeGeneratorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ThemeGeneratorInput>({
    resolver: zodResolver(ThemeGeneratorInputSchema),
    defaultValues: { prompt: '' },
  });

  const onSubmit: SubmitHandler<ThemeGeneratorInput> = async (data) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await generateTheme(data);
      setResponse(result);
      toast({
        title: `Theme "${result.themeName}" Generated!`,
        description: 'Review the theme below. Click "Apply" to update your site.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Theme',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApplyTheme = () => {
    if (!response) return;
    
    const newThemeCss = `:root {
    --background: ${response.background.hsl};
    --foreground: ${response.foreground.hsl};
    --card: ${response.card.hsl};
    --card-foreground: ${response.foreground.hsl};
    --popover: ${response.card.hsl};
    --popover-foreground: ${response.foreground.hsl};
    --primary: ${response.primary.hsl};
    --primary-foreground: ${response.background.hsl};
    --secondary: ${response.secondary.hsl};
    --secondary-foreground: ${response.foreground.hsl};
    --muted: ${response.secondary.hsl};
    --muted-foreground: ${response.foreground.hsl} / 0.6;
    --accent: ${response.accent.hsl};
    --accent-foreground: ${response.background.hsl};
    --destructive: ${response.destructive.hsl};
    --destructive-foreground: ${response.background.hsl};
    --border: ${response.border.hsl};
    --input: ${response.input.hsl};
    --ring: ${response.ring.hsl};
    --radius: 0.5rem;
}`;
    
    // In a real app, this would make an API call to a backend that can write to files.
    // For this prototype, we'll log to console. The backend will watch for this log.
    console.log("---- APPLYING NEW THEME ----");
    console.log("File: src/app/globals.css");
    console.log(newThemeCss);
    console.log("---- END THEME ----");

    store.set(s => ({
        ...s,
        themeCss: newThemeCss,
    }));


    toast({
        title: "Theme Applied!",
        description: "The application's color scheme has been updated. The changes might require a page refresh to take full effect.",
        duration: 9000,
    });
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette className="h-6 w-6 text-primary"/> AI Theme Generator</CardTitle>
          <CardDescription>Describe the look and feel you want, and our AI will generate a new color palette for your entire application.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme Description</FormLabel>
                    <FormControl>
                        <VoiceEnabledTextarea
                            placeholder="e.g., 'A professional and trustworthy theme for a financial services firm, using deep blues and a sophisticated gold accent.' or 'A fun, vibrant theme for a kids' app with bright yellows and playful oranges.'"
                            rows={4}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Palette...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate Theme</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        {response && (
            <CardFooter className="flex-col gap-4 items-stretch">
                <div className="text-center">
                    <p className="text-muted-foreground">Generated Theme:</p>
                    <h3 className="text-xl font-bold">{response.themeName}</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <ColorPreview title="Primary" color={response.primary} />
                    <ColorPreview title="Secondary" color={response.secondary} />
                    <ColorPreview title="Accent" color={response.accent} />
                    <ColorPreview title="Background" color={response.background} />
                    <ColorPreview title="Foreground" color={response.foreground} />
                    <ColorPreview title="Card" color={response.card} />
                    <ColorPreview title="Destructive" color={response.destructive} className="bg-destructive/10 border-destructive/20"/>
                </div>
                 <Button className="w-full mt-4" onClick={handleApplyTheme}>
                    <Wand2 className="mr-2 h-4 w-4" /> Apply This Theme
                </Button>
            </CardFooter>
        )}
      </Card>
      
      {isLoading && !response && (
         <Card>
            <CardContent className="p-6 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Mira is mixing the colors now...</p>
            </CardContent>
         </Card>
      )}

    </div>
  );
}
