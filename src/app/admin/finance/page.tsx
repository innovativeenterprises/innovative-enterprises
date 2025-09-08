
'use client';

import InvestorTable from "../investor-table";
import { useInvestorsData } from "@/hooks/use-global-store-data";
import CfoDashboard from "../cfo-dashboard";
import { useCfoData } from "@/hooks/use-global-store-data";

export default function AdminFinancePage() {
  const investorData = useInvestorsData();
  const cfoData = useCfoData();

  return (
    <div className="space-y-8">
        <CfoDashboard isClient={cfoData.isClient} />
        <InvestorTable {...investorData} />
    </div>
  );
}
