
'use client';

import InvestorTable from "../investor-table";
import CfoDashboard from "../cfo-dashboard";

export default function AdminFinancePage() {

  return (
    <div className="space-y-8">
        <CfoDashboard />
        <InvestorTable />
    </div>
  );
}
