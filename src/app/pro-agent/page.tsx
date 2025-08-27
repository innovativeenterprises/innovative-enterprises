
import { UserRoundCheck } from "lucide-react";
import ProForm from "./pro-form";

export default function ProAgentPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <UserRoundCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">PRO Task Delegation</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Efficiently manage your government-related tasks. Select a service, and our AI agent will prepare a complete assignment brief for your Public Relations Officer (PRO), including required documents, fee estimates, and a printable assignment sheet.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12">
            <ProForm />
        </div>
      </div>
    </div>
  );
}
