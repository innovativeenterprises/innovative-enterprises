

'use client';

import InvestorTable from "../investor-table";
import { useInvestorsData, useCfoData } from "@/hooks/use-global-store-data";
import CfoDashboard from "../cfo-dashboard";

export default function AdminFinancePage() {
  const investorData = useInvestorsData();
  const cfoData = useCfoData();

  return (
    <div className="space-y-8">
        <CfoDashboard {...cfoData} />
        <InvestorTable {...investorData} />
    </div>
  );
}
