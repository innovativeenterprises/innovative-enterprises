
import AuditForm from "./audit-form";
import { ShieldCheck } from "lucide-react";

export default function FinancialAuditPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Certus Audit Hub</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Connect with certified audit offices and leverage AI for a preliminary analysis of your financial documents. Secure, fast, and insightful.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <AuditForm />
        </div>
      </div>
    </div>
  );
}
