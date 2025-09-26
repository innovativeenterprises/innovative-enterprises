
'use client';

import RaahaFormClient from './client-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Find a Helper | RAAHA",
  description: "Describe your needs for a domestic helper, and our AI will search our network of vetted candidates to find the perfect match for you.",
};

export default function FindAHelperPage() {
    return <RaahaFormClient />;
}
