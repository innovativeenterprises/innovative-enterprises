
'use client';

import InvestorTable from "../investor-table";
import CfoDashboard from "../cfo-dashboard";
import CooDashboard from "../coo-dashboard";

export default function AdminFinancePage() {

  return (
    <div className="space-y-8">
        <CooDashboard />
        <CfoDashboard />
        <InvestorTable />
    </div>
  );
}
