import Link from 'next/link';
import { Lightbulb } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-accent" />
            <span className="font-bold text-lg text-primary">INNOVATIVE ENTERPRISES</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Innovative Enterprises. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
