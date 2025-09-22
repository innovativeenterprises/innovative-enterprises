
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github } from 'lucide-react';
import { useSettingsData } from '@/hooks/use-data-hooks';

export default function FooterClient() {
  const { settings, isClient } = useSettingsData();
  const currentYear = new Date().getFullYear().toString();

  // On the server or before client is ready, render a placeholder or nothing
  if (!isClient || !settings) {
      return (
          <footer className="border-t bg-card">
              <div className="container mx-auto py-8 px-4">
                  <div className="h-10 animate-pulse bg-muted rounded-md" />
              </div>
          </footer>
      );
  }
  
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto py-8 px-4">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center gap-2 justify-center md:justify-start">
             <Image src="/icon.png" alt="INNOVATIVE ENTERPRISES Logo" width={40} height={40} className="w-10 h-10" />
             <span className="font-bold text-lg">INNOVATIVE ENTERPRISES</span>
          </div>
          <div className="flex flex-col gap-4 items-center">
             <p className="text-sm text-muted-foreground text-center">
                © {currentYear} INNOVATIVE ENTERPRISES. All rights reserved.
              </p>
          </div>
          <div className="flex gap-4 items-center justify-center md:justify-end">
            <Link href="https://github.com/innovative-enterprises" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="/platform-statistics" className="text-sm text-muted-foreground hover:text-primary transition-colors">Statistics</Link>
            <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms-and-conditions" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
