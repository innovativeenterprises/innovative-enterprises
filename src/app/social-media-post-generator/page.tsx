'use client';

import SocialMediaForm from "./social-media-form";
import { Megaphone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Media Management Platform | Innovative Enterprises",
  description: "Craft the perfect social media post or generate engaging marketing copy with Mira, our Marketing & Content Agent.",
};

export default function SocialMediaManagementPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Megaphone className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Social Media Management Platform</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Craft the perfect social media post or generate engaging marketing copy. This service is powered by Mira, our Marketing & Content Agent.
          </p>
        </div>
        <div className="max-w-7xl mx-auto mt-12">
            <SocialMediaForm />
        </div>
      </div>
    </div>
  );
}
