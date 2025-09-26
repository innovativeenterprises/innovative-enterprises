
'use client';

import StairspaceClientPage from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "StairSpace | Micro-Retail Revolution",
    description: "A marketplace connecting property owners with entrepreneurs looking for affordable, flexible, and high-visibility micro-retail and storage spots."
};

export default function StairspacePage() {
    return <StairspaceClientPage />;
}
