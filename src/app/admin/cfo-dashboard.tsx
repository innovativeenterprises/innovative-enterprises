import CfoDashboardClient from './client-page';
import { kpiData, transactionData, upcomingPayments, vatPayment, cashFlowData } from '@/lib/cfo-data';
import { initialInvestors } from '@/lib/investors';

export default function CfoDashboard() {
    // Data is fetched on the server and passed down as props.
    // The client components will handle their own state.
    const cfoData = {
        kpiData,
        transactionData,
        upcomingPayments,
        vatPayment,
        cashFlowData,
        investors: initialInvestors,
    };
    return <CfoDashboardClient cfoData={cfoData} />;
}
