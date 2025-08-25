
import { Shield } from "lucide-react";
import AuditForm from "./audit-form";

export default function FinancialAuditPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Financial Audit Services Hub</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Connect with certified financial audit offices. Submit your documents for analysis and choose to assign the work directly, send it out to tender, or get a preliminary review from our AI agent, Finley.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <AuditForm />
        </div>
      </div>
    </div>
  );
}
