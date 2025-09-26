
'use server';

import AdminOperationsClientPage from "./client-page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Operations | Innovative Enterprises",
  description: "A suite of internal AI tools to enhance business operations.",
};


export default function AdminOperationsPage() {
    return <AdminOperationsClientPage />;
}
