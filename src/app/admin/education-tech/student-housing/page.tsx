'use client';

import { useLeasesData } from "@/hooks/use-data-hooks";
import StudentHousingClientPage from "./client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Student Housing Management | EduFlow Suite",
  description: "A centralized dashboard for managing student housing agreements and payments.",
};


export default function StudentHousingPage() {
    const { data: leases } = useLeasesData();
    return <StudentHousingClientPage initialLeases={leases} />;
}