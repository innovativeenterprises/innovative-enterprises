
import OpportunityTable from "../opportunity-table";
import PricingTable from "../pricing-table";
import SettingsTable from "../settings-table";

export default function AdminOperationsPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Operations</h1>
            <p className="text-muted-foreground">
                Manage business operations like opportunities and pricing.
            </p>
        </div>
        <OpportunityTable />
        <PricingTable />
    </div>
  );
}
