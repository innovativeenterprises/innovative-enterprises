
import CvForm from "./cv-form";

export default function CvEnhancerPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">GENIUS - AI-Powered Career Management Platform</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Leveraging cutting-edge AI to offer an end-to-end solution for career development—from document parsing to interview preparation—all within a seamless mobile and web experience.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <CvForm />
        </div>
      </div>
    </div>
  );
}
