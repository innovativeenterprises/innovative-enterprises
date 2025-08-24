
import { DollarSign, WalletCards } from "lucide-react";
import CfoDashboard from "./cfo-dashboard";

export default function CfoPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <WalletCards className="w-10 h-10 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">CFO Dashboard</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            This is the financial command center for your entire operation. Monitor cash flow, manage expenses, and oversee payroll with the help of Finley, your AI Finance & Accounting Agent.
          </p>
        </div>
        <div className="max-w-7xl mx-auto mt-12">
            <CfoDashboard />
        </div>
      </div>
    </div>
  );
}
