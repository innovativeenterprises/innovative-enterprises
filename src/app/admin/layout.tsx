
import AdminLayoutClient from './admin-layout-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
      default: 'Admin Dashboard',
      template: '%s | Admin Dashboard',
    },
    description: 'Manage the Innovative Enterprises platform.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
