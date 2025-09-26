'use server';

import HadeeyaClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hadeeya Gift Cards",
  description: "Create and send personalized digital gift cards for any occasion.",
};


export default async function HadeeyaPage() {
    return <HadeeyaClientPage />;
}
