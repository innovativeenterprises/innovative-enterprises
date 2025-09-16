import ImageForm from "./image-form";
import { Image as ImageIcon } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Image Generator | Innovative Enterprises",
  description: "Bring your ideas to life. Describe anything you can imagine, and our AI will create a unique, high-quality image for you in seconds.",
};


export default function ImageGeneratorPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <ImageIcon className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Image Generator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Bring your ideas to life. Describe anything you can imagine, and our AI will create a unique, high-quality image for you in seconds. This service is powered by Lina, our Content Creator Agent.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <ImageForm />
        </div>
      </div>
    </div>
  );
}
