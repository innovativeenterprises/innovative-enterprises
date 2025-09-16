
import OpportunityTable from '../opportunity-table';
import WorkOrderForm from '@/app/tender-assistant/work-order-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminOpportunitiesPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-muted-foreground">
                Manage all open projects, tasks, and competitions available to your partner network.
            </p>
        </div>
        
        <Card className="bg-muted/30">
            <CardHeader>
                <CardTitle>AI-Powered Idea Incubator</CardTitle>
                <CardDescription>Use the form below to submit a new idea. Our AI will analyze it and create a structured opportunity that you can then review and publish.</CardDescription>
            </CardHeader>
            <CardContent>
                 <WorkOrderForm />
            </CardContent>
        </Card>

        <OpportunityTable />
    </div>
  );
}
