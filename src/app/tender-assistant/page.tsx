import TenderForm from "./tender-form";

export default function TenderAssistantPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Tender Response Assistant</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Save time and effort preparing proposals. Upload your tender documents and project requirements to generate a compelling draft response with AI.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <TenderForm />
        </div>
      </div>
    </div>
  );
}
