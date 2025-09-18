
import GuardianAiClientPage from './client-page';
import { initialStudents } from '@/lib/students';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Guardian AI Dashboard | Innovative Enterprises",
  description: "A holistic overview of student wellbeing and career readiness, powered by AI.",
};

export default function GuardianAiPage() {
    return <GuardianAiClientPage initialStudents={initialStudents} />;
}
    
