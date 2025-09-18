import ProfessionalHubClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Professional Training & Education Hub",
  description: "A digital platform connecting trainers, educators, and professionals with their local markets, offering tools for marketing, networking, and business management.",
};


export default function ProfessionalHubPage() {
    return <ProfessionalHubClientPage />;
}
