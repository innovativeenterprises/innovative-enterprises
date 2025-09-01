
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CompanyProfileDownloader from '@/app/invest/company-profile-downloader';
import Image from 'next/image';

export default function Footer() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto py-8 px-4">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center gap-2 justify-center md:justify-start">
             <Image src="https://storage.googleapis.com/stella-images/studio-app-live/20240730-192534-315-lightbulb_logo.png" alt="Innovative Enterprises Logo" width={40} height={40} className="w-10 h-10" />
             <span className="font-bold text-lg">INNOVATIVE ENTERPRISES</span>
          </div>
          <div className="flex flex-col gap-4 items-center">
             {isClient && <CompanyProfileDownloader />}
             <p className="text-sm text-muted-foreground text-center">
                © {new Date().getFullYear()} Innovative Enterprises. All rights reserved.
              </p>
          </div>
          <div className="flex gap-4 justify-center md:justify-end">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
