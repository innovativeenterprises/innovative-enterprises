'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Rocket } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import React from 'react';

const navLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/#products', label: 'Products' },
  { href: '/#testimonials', label: 'Clients' },
  { href: '/automation', label: 'Automation' },
  { href: '/tender-assistant', label: 'Tender Assistant' },
  { href: '/faq', label: 'FAQ' },
  { href: '/legal-agent', label: 'Legal Agent'},
];

const partnershipLinks: { title: string; href: string; description: string }[] = [
  {
    title: "Be our Partner",
    href: "/partner",
    description:
      "Join us in a strategic partnership to drive mutual growth and success.",
  },
  {
    title: "Become a Service Provider",
    href: "/service-provider",
    description:
      "Offer your services to our clients and be part of our trusted network.",
  },
  {
    title: "Become our Agent",
    href: "/agent",
    description:
      "Represent Innovative Enterprises and earn commissions by bringing in new business.",
  },
  {
    title: "Let's be your CTO",
    href: "/cto",
    description:
      "Leverage our expertise to lead your technology strategy and execution.",
  },
  {
    title: "Invest with us",
    href: "/invest",
    description:
      "Explore investment opportunities and be part of our innovation journey.",
  },
]


export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const renderNavLinks = (isMobile: boolean) => (
    navLinks.map((link) => {
      const isToolPage = ['/tender-assistant', '/faq', '/automation', '/legal-agent'].includes(link.href);
      const isActive = isToolPage ? pathname === link.href : false;

      return (
        <Button
          key={link.href}
          asChild
          variant="ghost"
          className={cn(
            'justify-start text-base font-medium',
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
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="bg-primary p-2 rounded-lg">
            <Rocket className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline">INNOVATIVE</span>
          <span className="sm:hidden">IE</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {renderNavLinks(false)}
           <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">Partnerships</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {partnershipLinks.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden md:flex">Contact Us</Button>
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
                        <div className="bg-primary p-2 rounded-lg">
                            <Rocket className="h-6 w-6 text-primary-foreground" />
                        </div>
                    <span>INNOVATIVE ENTERPRISES</span>
                    </Link>
                    <nav className="flex flex-col gap-2">
                    {renderNavLinks(true)}
                    {partnershipLinks.map((link) => (
                        <Button
                        key={link.href}
                        asChild
                        variant="ghost"
                        className="justify-start text-base"
                        onClick={handleLinkClick}
                        >
                        <Link href={link.href}>{link.title}</Link>
                        </Button>
                    ))}
                    </nav>
                    <Button className="mt-4">Contact Us</Button>
                </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
