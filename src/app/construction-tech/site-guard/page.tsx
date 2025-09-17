
import SiteGuardClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "SiteGuard Compliance | Innovative Enterprises",
  description: "Use our AI-powered mobile safety inspection app. Perform live safety checks for Personal Protective Equipment (PPE) compliance on your construction site.",
};

export default function SiteGuardPage() {
  return <SiteGuardClientPage />;
}
