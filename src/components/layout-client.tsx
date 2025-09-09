
'use client';

import * as React from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

// This is a new client component that wraps the main layout logic.
// It allows us to keep the root layout as a pure server component.
export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};
