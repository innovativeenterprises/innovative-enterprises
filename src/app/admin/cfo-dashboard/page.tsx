import CfoDashboard from '../cfo-dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI COO & CFO Dashboard",
  description: "JADE's real-time operational analysis and financial overview of the entire business ecosystem.",
};

export default function CooDashboardPage() {
    return <CfoDashboard />;
}
