import CvForm from "./cv-form";

export default function CvEnhancerPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">CV ATS Enhancer</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Upload your CV and our AI agent will analyze it for Applicant Tracking System (ATS) compatibility, providing you with actionable feedback to improve your job application success rate.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <CvForm />
        </div>
      </div>
    </div>
  );
}
