import SocialMediaForm from "./social-media-form";

export default function SocialMediaPostGeneratorPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Social Media Post Generator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Craft the perfect social media post for any occasion. Just provide a topic, choose a platform and tone, and let our AI do the rest.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <SocialMediaForm />
        </div>
      </div>
    </div>
  );
}
