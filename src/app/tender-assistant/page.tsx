
import SocialMediaForm from "../social-media-post-generator/social-media-form";
import { Megaphone } from "lucide-react";

export default function TenderAssistantPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Megaphone className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Marketing & Content Agent</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Craft the perfect social media post, generate marketing copy, or get help drafting a tender response. This service is powered by Mira, our Marketing & Content Agent.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <SocialMediaForm />
        </div>
      </div>
    </div>
  );
}
