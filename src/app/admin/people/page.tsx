import { getStaffData } from "@/lib/firestore";
import PeoplePageClient from "./client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "People Management | Innovative Enterprises",
  description: "Manage your internal human and AI workforce.",
};

export default async function PeoplePage() {
    const staffData = await getStaffData();

    return <PeoplePageClient initialStaffData={staffData} />;
}
