
import OpportunityTable from '../opportunity-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { initialOpportunities } from '@/lib/opportunities';

export default function AdminOpportunitiesPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-muted-foreground">
                Manage all open projects, tasks, and competitions available to your partner network.
            </p>
        </div>

        <OpportunityTable initialOpportunities={initialOpportunities} />
    </div>
  );
}
