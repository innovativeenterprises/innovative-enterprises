'use server';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getSolutions, getIndustries, getAiTools, getSettings } from '@/lib/firestore';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const [solutions, industries, aiTools, settings] = await Promise.all([
        getSolutions(),
        getIndustries(),
        getAiTools(),
        getSettings(),
    ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        solutions={solutions}
        industries={industries}
        aiTools={aiTools}
        settings={settings}
      />
      <main className="flex-grow">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
