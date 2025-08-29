
'use client';

import CfoDashboard from "@/app/cfo/cfo-dashboard";
import InvestorTable, { useInvestorsData } from "./investor-table";

export default function AdminFinancePage() {
  const investorData = useInvestorsData();

  return (
    <div className="space-y-8">
        <CfoDashboard />
        <InvestorTable {...investorData} />
    </div>
  );
}
