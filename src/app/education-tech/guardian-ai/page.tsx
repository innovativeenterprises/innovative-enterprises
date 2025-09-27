
'use server';

import GuardianAiClientPage from './client-page';
import type { Metadata } from 'next';
import { getStudents } from '@/lib/firestore';

export const metadata: Metadata = {
  title: "Guardian AI | Student Success Platform",
  description: "A holistic overview of student wellbeing and career readiness, featuring AI-powered support tools.",
};


export default async function GuardianAiPage() {
    const students = await getStudents();
    return <GuardianAiClientPage initialStudents={students} />;
}
