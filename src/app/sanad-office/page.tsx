
import { Handshake } from "lucide-react";
import OfficeForm from "./office-form";

export default function SanadOfficePage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Handshake className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Join the Sanad Hub Network</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Register your Sanad Service Centre to receive new client tasks, send quotes, and grow your business. Use our AI-powered onboarding to get started in minutes.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <OfficeForm />
        </div>
      </div>
    </div>
  );
}
