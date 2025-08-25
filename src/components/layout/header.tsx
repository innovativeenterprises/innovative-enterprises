
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Lightbulb, Sparkles, User, AdminPanelSettings, Briefcase } from 'lucide-react';
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
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from 'react';

const navLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/#products', label: 'Products' },
  { href: '/#testimonials', label: 'Clients' },
  { href: '/team', label: 'Our Team' },
];

const aiToolsLinks: { title: string; href: string; description: string }[] = [
  {
    title: "CFO Dashboard",
    href: "/cfo",
    description: "Manage all financial operations with Finley, your AI finance agent.",
  },
  {
    title: "Online Meeting Agent",
    href: "/meeting-agent",
    description: "Generate minutes and action items from a meeting transcript automatically.",
  },
  {
    title: "Tender Response Assistant",
    href: "/tender-assistant",
    description: "Generate draft responses to government tenders in minutes.",
  },
   {
    title: "Document Translator",
    href: "/document-translator",
    description: "Translate legal, financial, and official documents with high accuracy.",
  },
  {
    title: "AI Legal Agent",
    href: "/legal-agent",
    description: "Get preliminary legal analysis and insights from our AI agent.",
  },
  {
    title: "CV ATS Enhancer",
    href: "/cv-enhancer",
    description: "Optimize your CV for Applicant Tracking Systems.",
  },
  {
    title: "AI Training Center",
    href: "/training-center",
    description: "Fine-tune your agents with custom data for better performance.",
  },
  {
    title: "Social Media Post Generator",
    href: "/social-media-post-generator",
    description: "Craft compelling social media posts for any topic or platform.",
  },
  {
    title: "AI Image Generator",
    href: "/image-generator",
    description: "Create stunning visuals from text descriptions in seconds.",
  }
];

const partnershipLinks: { title: string; href: string; description: string }[] = [
   {
    title: "Submit a Work Order",
    href: "/submit-work",
    description:
      "Have a project or task? Submit it here for analysis and routing to our talent network.",
  },
  {
    title: "Be our Partner",
    href: "/partner",
    description:
      "Join us in a strategic partnership to drive mutual growth and success.",
  },
  {
    title: "Work With Us",
    href: "/service-provider",
    description:
      "Offer your services to our clients. We welcome freelancers, outsourcers, and subcontractors.",
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
  {
    title: "Competitions & Tasks",
    href: "/opportunities",
    description:
        "View open competitions and tasks for our network of freelancers and partners.",
  }
]


export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const renderNavLinks = (isMobile: boolean) => (
    navLinks.map((link) => (
        <Button
          key={link.href}
          asChild
          variant="ghost"
          className={cn(
            'justify-start text-base font-medium',
            isMobile ? 'w-full' : ''
          )}
          onClick={handleLinkClick}
        >
          <Link href={link.href}>{link.label}</Link>
        </Button>
      )
    )
  );

  const aiToolsMenuContent = (
      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
        {aiToolsLinks.map((component) => (
          <ListItem
            key={component.title}
            title={component.title}
            href={component.href}
            onClick={handleLinkClick}
          >
            {component.description}
          </ListItem>
        ))}
      </ul>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="bg-primary p-2 rounded-lg">
            <Lightbulb className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline">INNOVATIVE</span>
          <span className="sm:hidden">IE</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {renderNavLinks(false)}
           <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">
                  <Sparkles className="mr-2 h-4 w-4" /> AI Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  {aiToolsMenuContent}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">Partnerships</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {partnershipLinks.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                        onClick={handleLinkClick}
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
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <User className="h-5 w-5" />
                        <span className="sr-only">My Account</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/briefcase"><Briefcase className="mr-2 h-4 w-4" /> E-Briefcase</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem>Log Out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
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
                            <Lightbulb className="h-6 w-6 text-primary-foreground" />
                        </div>
                    <span>INNOVATIVE ENTERPRISES</span>
                    </Link>
                    <nav className="flex flex-col gap-2">
                      {renderNavLinks(true)}
                       <p className="px-3 pt-4 pb-2 text-sm font-semibold text-muted-foreground">AI Tools</p>
                      {aiToolsLinks.map((link) => (
                          <Button
                          key={link.href}
                          asChild
                          variant="ghost"
                          className={cn("justify-start text-base", pathname === link.href && 'bg-primary/10 text-primary')}
                          onClick={handleLinkClick}
                          >
                          <Link href={link.href}>{link.title}</Link>
                          </Button>
                      ))}
                      <p className="px-3 pt-4 pb-2 text-sm font-semibold text-muted-foreground">Partnerships</p>
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
                        <p className="px-3 pt-4 pb-2 text-sm font-semibold text-muted-foreground">My Account</p>
                        <Button
                          asChild
                          variant="ghost"
                          className="justify-start text-base"
                          onClick={handleLinkClick}
                          >
                          <Link href="/briefcase"><Briefcase className="mr-2 h-4 w-4"/> E-Briefcase</Link>
                        </Button>
                         <Button
                          asChild
                          variant="ghost"
                          className="justify-start text-base"
                          onClick={handleLinkClick}
                          >
                          <Link href="/admin">Admin Dashboard</Link>
                        </Button>
                    </nav>
                    <Button className="mt-4">Log Out</Button>
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
