
'use client';

import StudentFinancialsClientPage from "./client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Student Financials | EduFlow Suite",
  description: "A dashboard for managing student tuition, scholarships, and payments.",
};


export default function AdminStudentFinancialsPage() {
    return <StudentFinancialsClientPage />;
}
