
'use server';

import type { Metadata } from 'next';
import TeamClientPage from './client-page';

export const metadata: Metadata = {
  title: "Our Team | Innovative Enterprises",
  description: "Meet the human experts and the AI-powered digital workforce behind our innovative solutions.",
};

export default async function TeamPage() {
    return <TeamClientPage />;
}
