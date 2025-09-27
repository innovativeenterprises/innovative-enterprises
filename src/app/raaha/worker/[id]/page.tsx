
'use server';

import { getRaahaData } from '@/lib/firestore';
import WorkerProfileClientPage from './client-page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { raahaWorkers } = await getRaahaData();
  const worker = raahaWorkers.find(p => p.id === params.id);

  if (!worker) {
    return {
      title: 'Candidate Not Found',
    };
  }

  return {
    title: `${worker.name} | Candidate Profile`,
    description: `Profile for ${worker.name}, a domestic worker candidate specializing in ${worker.skills.join(', ')}.`,
  };
}


export default async function WorkerProfilePage({ params }: { params: { id: string } }) {
    const { raahaWorkers, raahaAgencies } = await getRaahaData();
    const worker = raahaWorkers.find(p => p.id === params.id);
    
    if (!worker) {
        notFound();
    }

    const agency = raahaAgencies.find(a => a.id === worker?.agencyId);
    
    return <WorkerProfileClientPage worker={worker} agency={agency} />;
}
