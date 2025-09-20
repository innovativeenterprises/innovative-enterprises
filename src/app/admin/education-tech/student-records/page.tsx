
import StudentRecordsPage from '@/app/education-tech/student-records/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin - Student Records",
  description: "A central database for managing all student profiles and academic records.",
};


export default function AdminStudentRecordsPage() {
    return <StudentRecordsPage />;
}
