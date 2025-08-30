
'use client';

import InvestorTable, { useInvestorsData } from "../investor-table";

export default function AdminFinancePage() {
  const investorData = useInvestorsData();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Platform Finance</h1>
            <p className="text-muted-foreground">
                Manage all financial partners, investors, and funding sources for the platform.
            </p>
        </div>
        <InvestorTable {...investorData} />
    </div>
  );
}
