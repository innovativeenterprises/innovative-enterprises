
import { Suspense } from 'react';
import GuardianAiClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Guardian AI | Student Success Platform",
  description: "A holistic overview of student wellbeing and career readiness, featuring AI-powered support tools.",
};


export default function GuardianAiPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GuardianAiClientPage />
        </Suspense>
    )
}
