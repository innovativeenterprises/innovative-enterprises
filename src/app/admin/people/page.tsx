
'use client';

import StaffTable from "../staff-table";
import { useStaffData, setLeadership, setStaff, setAgentCategories } from '@/hooks/use-global-store-data';

export default function AdminPeoplePage() {
  const staffData = useStaffData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">People Management</h1>
            <p className="text-muted-foreground">
                Manage your internal human and AI workforce.
            </p>
        </div>

        <StaffTable 
            leadership={staffData.leadership}
            setLeadership={setLeadership}
            staff={staffData.staff}
            setStaff={setStaff}
            agentCategories={staffData.agentCategories}
            setAgentCategories={setAgentCategories}
            isClient={staffData.isClient}
        />
    </div>
  );
}
