
import AmeenClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Ameen: Smart Identity & Home",
  description: "Your single, secure point of control. Log in with your WhatsApp-based digital ID to manage your smart home devices.",
};


export default function AmeenPage() {
    return <AmeenClientPage />;
}
