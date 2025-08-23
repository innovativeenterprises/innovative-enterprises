import LegalForm from "./legal-form";

export default function LegalAgentPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Legal Agent</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Get preliminary legal analysis and insights from our AI agent.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <LegalForm />
        </div>
      </div>
    </div>
  );
}
