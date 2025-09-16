import { useState } from 'react';
import VideoForm from "./video-form";
import { Video } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "VEO Video Factory | Innovative Enterprises",
  description: "Turn your ideas into motion. Describe a scene, and our AI will generate a short video clip for you.",
};


export default function VideoGeneratorPage() {
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
                <VideoForm />
            </div>
        </div>
    </div>
  );
}
