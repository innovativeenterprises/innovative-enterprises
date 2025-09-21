
'use server';

import { getStaffData } from "@/lib/firestore";
import type { Metadata } from 'next';
import TeamClientPage from './client-page';

export const metadata: Metadata = {
  title: "Our Team | Innovative Enterprises",
  description: "Meet the human experts and AI-powered digital workforce behind our innovative solutions.",
};

export default async function TeamPage() {
    const staffData = await getStaffData();

    return <TeamClientPage initialStaffData={staffData} />;
}
