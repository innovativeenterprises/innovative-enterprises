

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InterviewCoachRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/cv-enhancer?tab=interview');
  }, [router]);

  return (
    <div className="container mx-auto text-center py-20">
      <h1 className="text-2xl font-bold">This page has moved.</h1>
      <p className="text-muted-foreground">The AI Interview Coach is now part of the GENIUS Career Platform.</p>
      <Button asChild className="mt-4">
        <Link href="/cv-enhancer?tab=interview">Go to GENIUS Platform</Link>
      </Button>
    </div>
  );
}
