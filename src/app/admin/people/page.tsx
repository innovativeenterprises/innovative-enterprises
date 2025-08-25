
import StaffTable from "../staff-table";
import ProviderTable from "../provider-table";

export default function AdminPeoplePage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">People & Network</h1>
            <p className="text-muted-foreground">
                Manage your internal staff and external network of providers.
            </p>
        </div>
        <StaffTable />
        <ProviderTable />
    </div>
  );
}
