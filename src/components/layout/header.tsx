'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Rocket } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/#products', label: 'Products' },
  { href: '/#testimonials', label: 'Clients' },
  { href: '/tender-assistant', label: 'Tender Assistant' },
  { href: '/faq', label: 'FAQ' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const renderNavLinks = (isMobile: boolean) => (
    navLinks.map((link) => {
      const isToolPage = ['/tender-assistant', '/faq'].includes(link.href);
      const isActive = isToolPage ? pathname === link.href : false;

      return (
        <Button
          key={link.href}
          asChild
          variant="ghost"
          className={cn(
            'justify-start text-base',
            isActive && 'bg-primary/10 text-primary',
            isMobile ? 'w-full' : ''
          )}
          onClick={handleLinkClick}
        >
          <Link href={link.href}>{link.label}</Link>
        </Button>
      );
    })
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Rocket className="h-6 w-6 text-accent" />
          <span className="hidden sm:inline">INNOVATIVE ENTERPRISES</span>
          <span className="sm:hidden">IE</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {renderNavLinks(false)}
        </nav>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 py-8">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary mb-4 px-2" onClick={handleLinkClick}>
                  <Rocket className="h-6 w-6 text-accent" />
                  <span>INNOVATIVE ENTERPRISES</span>
                </Link>
                <nav className="flex flex-col gap-2">
                  {renderNavLinks(true)}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
