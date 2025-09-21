
'use server';

import GuardianAiClientPage from './client-page';
import { getStudents } from '@/lib/firestore';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Guardian AI | Student Success Platform",
  description: "A holistic overview of student wellbeing and career readiness, featuring AI-powered support tools.",
};


export default async function GuardianAiPage() {
    const students = await getStudents();
    return <GuardianAiClientPage initialStudents={students} />;
}
