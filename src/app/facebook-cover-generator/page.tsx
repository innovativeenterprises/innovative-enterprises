

'use client';

import { ImageIcon } from "lucide-react";
import GeneratorForm from "./generator-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Facebook Cover Generator | Innovative Enterprises",
  description: "Create a professional Facebook cover photo in seconds. Just describe your business and desired style, and let our AI design a stunning, on-brand image for you.",
};

export default function FacebookCoverGeneratorPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <ImageIcon className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Facebook Cover Generator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Create a professional Facebook cover photo in seconds. Just describe your business and desired style, and let our AI design a stunning, on-brand image for you.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12">
            <GeneratorForm />
        </div>
      </div>
    </div>
  );
}
