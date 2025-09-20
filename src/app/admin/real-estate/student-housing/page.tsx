

import StudentHousingPage from '@/app/real-estate-tech/student-housing/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - Student Housing | Innovative Enterprises",
  description: "A centralized dashboard for managing student housing agreements and payments.",
};


export default function AdminStudentHousingPage() {
    return <StudentHousingPage />;
}
