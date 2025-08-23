import SocialMediaForm from "./social-media-form";

export default function AutomationPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Automation Services</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Leverage our AI agents to automate your business processes. Start with our Social Media Post Generator to streamline your content creation.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <SocialMediaForm />
        </div>
      </div>
    </div>
  );
}
