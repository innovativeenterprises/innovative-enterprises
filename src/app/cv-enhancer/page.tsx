import CvForm from "./cv-form";

export default function CvEnhancerPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">CV ATS Enhancer</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Get a step-by-step CV enhancement. Upload your CV for an initial ATS analysis, then let our AI rebuild it for your target job position.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <CvForm />
        </div>
      </div>
    </div>
  );
}
