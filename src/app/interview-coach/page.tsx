
// This page is now obsolete as the coach form is integrated into the /cv-enhancer page.
// We will redirect users or update links to point to /cv-enhancer?tab=interview
// For now, we'll keep a simple component here.

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InterviewCoachRedirectPage() {
  return (
    <div className="container mx-auto text-center py-20">
      <h1 className="text-2xl font-bold">This page has moved.</h1>
      <p className="text-muted-foreground">The AI Interview Coach is now part of the GENIUS Career Platform.</p>
      <Button asChild className="mt-4">
        <Link href="/cv-enhancer">Go to GENIUS Platform</Link>
      </Button>
    </div>
  );
}
