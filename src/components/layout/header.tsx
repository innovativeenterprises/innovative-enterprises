

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Sparkles, User, Briefcase, ShoppingCart, Handshake, Building, Shield, Server, Video, ServerCog, Lightbulb, UserRoundCheck, Mic } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
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
import Image from 'next/image';
import { store } from '@/lib/global-store';
import type { CartItem } from '@/lib/global-store';

const navLinks = [
  { href: '/#products', label: 'Products' },
  { href: '/#testimonials', label: 'Clients' },
  { href: '/team', label: 'Our Team' },
];

const serviceLinks: { title: string; href: string; description: string }[] = [
  {
    title: "Sanad Hub Platform",
    href: "/sanad-hub",
    description: "A digital gateway connecting users with Sanad Service Centres across Oman for task delegation and service bidding.",
  },
  {
    title: "Business Hub",
    href: "/business-hub",
    description: "A B2B and B2C marketplace connecting businesses with each other and with new clients for opportunities.",
  },
  {
    title: "Nova Commerce",
    href: "/ecommerce",
    description: "End-to-end solutions to build, manage, and scale your online business.",
  },
  {
    title: "InfraRent",
    href: "/infra-rent",
    description: "On-demand rental of IT equipment like servers, workstations, and networking gear.",
  },
   {
    title: "RAAHA Platform",
    href: "/raaha",
    description: "An AI-powered white-label platform to connect domestic work agencies with clients.",
  },
   {
    title: "Finley CFO Service",
    href: "/cfo",
    description: "Access a financial command center to monitor cash flow, manage expenses, and oversee payroll.",
  },
   {
    title: "GENIUS Career Platform",
    href: "/cv-enhancer",
    description: "Optimize CVs for ATS and get support for skilled labor provision and recruitment.",
  },
  {
    title: "Certus Audit Hub",
    href: "/financial-audit",
    description: "Connect with certified audit offices and get AI-powered analysis of your financial documents.",
  },
  {
    title: "Vision AI Estimator",
    href: "/cctv-estimator",
    description: "Get an AI-powered quotation for your surveillance system needs, from design to installation.",
  },
  {
    title: "Browse IT Rentals",
    href: "/rentals",
    description: "View our catalog of available IT hardware and cloud infrastructure for rent.",
  },
];


const aiToolsLinks: { title: string; href: string; description: string }[] = [
   {
    title: "PRO Agent",
    href: "/pro-agent",
    description: "Delegate government service tasks, get fee estimates, and generate assignment documents.",
  },
  {
    title: "IT Solutions Architect",
    href: "/it-rental-agent",
    description: "Describe your project and get a custom-designed infrastructure rental package instantly.",
  },
  {
    title: "Online Meeting Agent",
    href: "/meeting-agent",
    description: "Generate minutes and action items from a meeting transcript automatically.",
  },
  {
    title: "Mira Marketing Agent",
    href: "/social-media-post-generator",
    description: "Generate social media posts, marketing copy, and other creative content.",
  },
   {
    title: "Voxi Translator",
    href: "/document-translator",
    description: "Translate legal, financial, and official documents with high accuracy.",
  },
  {
    title: "Aida Legal Assistant",
    href: "/legal-agent",
    description: "Get preliminary analysis, draft agreements, or ask general questions from our AI agent, Aida.",
  },
   {
    title: "AI Interview Coach",
    href: "/interview-coach",
    description: "Practice for your next job interview with AI-generated questions.",
  },
  {
    title: "AI Training Center",
    href: "/training-center",
    description: "Fine-tune your agents with custom data for better performance.",
  },
  {
    title: "AI Image Generator",
    href: "/image-generator",
    description: "Create stunning visuals from text descriptions in seconds.",
  },
  {
    title: "Tender Response Assistant",
    href: "/tender-assistant",
    description: "Generate comprehensive and professional draft responses to help you win your next bid.",
  },
];

const partnershipLinks: { title: string; href: string; description: string }[] = [
   {
    title: "Submit a Work Order",
    href: "/submit-work",
    description:
      "Have a project or task? Submit it here for analysis and routing to our talent network.",
  },
   {
    title: "Competitions & Opportunities",
    href: "/opportunities",
    description:
        "View open competitions and tasks for our network of freelancers and partners.",
  },
  {
    title: "Become a Partner",
    href: "/partner",
    description:
      "Join our network of freelancers, subcontractors, and service providers.",
  },
  {
    title: "Become an Agent",
    href: "/agent",
    description:
      "Represent Innovative Enterprises and earn commissions by bringing in new business.",
  },
  {
    title: "Become our Fractional CTO",
    href: "/cto",
    description:
      "Leverage our expertise to lead your technology strategy and execution.",
  },
  {
    title: "Invest With Us",
    href: "/invest",
    description:
      "Explore investment opportunities and be part of our innovation journey.",
  },
]


export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
        const currentCart = store.get().cart;
        setCartCount(currentCart.reduce((sum, item) => sum + item.quantity, 0));
    }
    updateCartCount(); // Initial count
    const unsubscribe = store.subscribe(updateCartCount);
    return () => unsubscribe();
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const renderNavLinks = () => (
    navLinks.map((link) => (
        <NavigationMenuItem key={link.href}>
          <NavigationMenuLink asChild>
            <Link
              href={link.href}
              className={cn(navigationMenuTriggerStyle(), 'text-base font-medium')}
            >
              {link.label}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      )
    )
  );
  
   const mobileNavLinks = (
        <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
                <Button
                key={link.href}
                asChild
                variant="ghost"
                className="justify-start text-base"
                onClick={handleLinkClick}
                >
                <Link href={link.href}>{link.label}</Link>
                </Button>
            ))}
        </div>
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Image src="https://storage.googleapis.com/stella-images/studio-app-live/20240801-140026-646-logo.png" alt="Innovative Enterprises Logo" width={160} height={40} className="w-40 h-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-1">
           <NavigationMenu>
            <NavigationMenuList>
              {renderNavLinks()}
               <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {serviceLinks.map((component) => (
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
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">
                  <Sparkles className="mr-2 h-4 w-4" /> AI Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
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
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">Opportunities & Network</NavigationMenuTrigger>
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
            <Button variant="outline" size="icon" asChild>
                <Link href="/ecommerce/cart" className="relative">
                     {cartCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs">{cartCount}</span>}
                    <ShoppingCart className="h-5 w-5" />
                    <span className="sr-only">Shopping Cart</span>
                </Link>
            </Button>
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
                        <Image src="https://storage.googleapis.com/stella-images/studio-app-live/20240801-140026-646-logo.png" alt="Innovative Enterprises Logo" width={160} height={40} className="w-40 h-auto object-contain" />
                    </Link>
                    <nav className="flex flex-col gap-2">
                      {mobileNavLinks}
                      <p className="px-3 pt-4 pb-2 text-sm font-semibold text-muted-foreground">Services</p>
                      {serviceLinks.map((link) => (
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
                      <p className="px-3 pt-4 pb-2 text-sm font-semibold text-muted-foreground">Opportunities & Network</p>
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
