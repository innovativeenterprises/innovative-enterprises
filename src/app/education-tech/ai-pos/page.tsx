

import AiPosPage from '@/app/ai-pos/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI-POS for Education | Innovative Enterprises",
  description: "A smart, AI-driven Point-of-Sale system for school and university canteens, providing inventory management and sales analytics.",
};

// This page re-uses the main AI-POS component, demonstrating how a core
// platform feature can be repurposed for a specific industry vertical.
export default function AiPosForEducationPage() {
    return <AiPosPage />;
}
