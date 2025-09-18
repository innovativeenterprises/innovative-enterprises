
import AdmissionsDashboardClient from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admissions Dashboard",
  description: "An overview of all submitted student applications.",
};

// Placeholder data - in a real app, this would come from a database.
const initialApplications = [
    { id: 'APP-12345678', name: 'Nasser Al-Busaidi', program: 'B.Sc. in Artificial Intelligence', readinessScore: 92, status: 'Interview' },
    { id: 'APP-87654321', name: 'Fatima Al-Hinai', program: 'M.Sc. in Data Science', readinessScore: 85, status: 'Conditional Offer' },
    { id: 'APP-23456789', name: 'John Smith', program: 'B.Eng. in Robotics', readinessScore: 78, status: 'Interview' },
    { id: 'APP-98765432', name: 'Aisha Al-Riyami', program: 'B.Sc. in Artificial Intelligence', readinessScore: 65, status: 'Further Review' },
    { id: 'APP-34567890', name: 'Mohammed Al-Farsi', program: 'Ph.D. in Machine Learning', readinessScore: 45, status: 'Reject' },
];


export default function AdmissionsDashboardPage() {
    // In a real app, you would fetch this data from your database, e.g.:
    // const applications = await db.collection('admissions').get();
    return <AdmissionsDashboardClient initialApplications={initialApplications} />;
}
