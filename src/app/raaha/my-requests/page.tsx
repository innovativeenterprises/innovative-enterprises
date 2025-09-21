
'use server';

import MyRequestsClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "My Hire Requests | RAAHA",
  description: "Track the status of your applications for domestic helpers.",
};


export default async function MyRequestsPage() {
    return <MyRequestsClientPage />
}
