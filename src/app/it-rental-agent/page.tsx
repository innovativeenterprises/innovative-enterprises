
import { ServerCog } from "lucide-react";
import ItRentalAgentForm from "./agent-form";

export default function ItRentalAgentPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <ServerCog className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">IT Infrastructure Solutions Agent</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Describe your project needs, and our AI Solutions Architect will instantly design a custom hardware package and proposal for you.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <ItRentalAgentForm />
        </div>
      </div>
    </div>
  );
}
