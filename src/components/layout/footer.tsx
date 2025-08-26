
import Link from 'next/link';
import { Lightbulb } from 'lucide-react';
import CompanyProfileDownloader from '@/app/invest/company-profile-downloader';
import { Button } from '../ui/button';

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto py-8 px-4">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <Lightbulb className="h-6 w-6 text-accent" />
            <span className="font-bold text-lg text-primary">INNOVATIVE ENTERPRISES</span>
          </div>
          <div className="flex flex-col gap-4 items-center">
             <CompanyProfileDownloader />
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
