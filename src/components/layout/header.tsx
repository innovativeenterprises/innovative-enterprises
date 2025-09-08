

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu, Sparkles, User, Briefcase, ShoppingCart, Handshake, Building, Shield, Server, Video, ServerCog, Lightbulb, UserRoundCheck, Mic, FileText, Languages, Scale, Trophy, Cpu, Search, BrainCircuit, HardHat, Building2, GraduationCap, Users } from 'lucide-react';
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
import HomeWorkforceIcon from '@/components/icons/home-workforce-icon';
import { useSettingsData } from '@/hooks/use-global-store-data';
import { ScrollArea } from '../ui/scroll-area';

const navLinks = [
  { href: '/team', label: 'Our Team' },
];

const solutionsByCategory: { category: string; items: { title: string; href: string; description: string, icon: LucideIcon }[] }[] = [
    {
        category: "Business Platforms",
        items: [
            {
                title: "Sanad Hub Platform",
                href: "/sanad-hub",
                description: "A digital gateway connecting users with Sanad Service Centres across Oman for task delegation and service bidding.",
                icon: Shield,
            },
            {
                title: "Business Hub",
                href: "/business-hub",
                description: "A B2B marketplace connecting businesses with each other and with new clients for opportunities.",
                icon: Handshake,
            },
            {
                title: "Nova Commerce",
                href: "/ecommerce",
                description: "End-to-end solutions to build, manage, and scale your online business.",
                icon: ShoppingCart,
            },
             {
                title: "Ameen Digital Identity",
                href: "/ameen",
                description: "Secure, password-free login using your WhatsApp account and other advanced authentication solutions.",
                icon: UserCheck,
            },
            {
                title: "Community Hub",
                href: "/community-hub",
                description: "A digital platform for expatriate communities and charities to manage their own affairs, elections, and events.",
                icon: Users,
            },
        ]
    },
    {
        category: "Industry Solutions",
        items: [
             {
                title: "Construction Tech",
                href: "/construction-tech",
                description: "Explore our suite of SaaS solutions designed to automate and innovate the construction industry.",
                icon: HardHat,
            },
            {
                title: "Real Estate Tech",
                href: "/real-estate-tech",
                description: "A suite of automated SaaS platforms for property valuation, management, and investment.",
                icon: Building2,
            },
            {
                title: "Education Tech",
                href: "/education-tech",
                description: "AI-driven platforms to enhance learning, streamline administration, and improve student outcomes.",
                icon: GraduationCap,
            },
             {
                title: "InfraRent",
                href: "/infra-rent",
                description: "On-demand rental of IT equipment like servers, workstations, and networking gear for events and projects.",
                icon: Server,
            },
             {
                title: "RAAHA Platform",
                href: "/raaha",
                description: "An AI-powered white-label SaaS platform to connect domestic work agencies with clients.",
                icon: HomeWorkforceIcon,
            },
        ]
    },
    {
        category: "AI Tools",
        items: [
            {
                title: "Voxi Translator",
                href: "/document-translator",
                description: "Translate legal, financial, and official documents with high accuracy.",
                icon: Languages,
            },
            {
                title: "Lina Image Generator",
                href: "/image-generator",
                description: "Create stunning visuals from text descriptions in seconds.",
                icon: Lightbulb,
            },
            {
                title: "VEO Video Factory",
                href: "/video-generator",
                description: "Generate short video clips from text prompts using AI.",
                icon: Video,
            },
            {
                title: "AI Interior Designer",
                href: "/interior-designer",
                description: "Upload a photo of your room and get instant interior design ideas powered by AI.",
                icon: Home,
            },
        ]
    },
    {
        category: "Professional Services",
        items: [
            {
                title: "Lexi Legal Assistant",
                href: "/legal-agent",
                description: "Ask legal questions or analyze documents for potential risks and get preliminary advice.",
                icon: Scale,
            },
            {
                title: "Certus Audit Hub",
                href: "/financial-audit",
                description: "Connect with certified audit offices and get AI-powered analysis of your financial documents.",
                icon: FileText,
            },
            {
                title: "Tender Response Assistant",
                href: "/tender-assistant",
                description: "Upload tender documents and let our AI generate a comprehensive draft response.",
                icon: FileText,
            },
             {
                title: "GENIUS Career Platform",
                href: "/cv-enhancer",
                description: "Optimize CVs for ATS and get support for skilled labor provision and recruitment.",
                icon: UserRoundCheck,
            },
        ]
    }
];

const opportunitiesLinks: { title: string; href: string; description: string, icon: LucideIcon }[] = [
   {
    title: "Competitions & Opportunities",
    href: "/opportunities",
    description:
        "View open competitions and tasks for our network of freelancers and partners.",
    icon: Trophy,
  },
  {
    title: "Submit a Work Order",
    href: "/submit-work",
    description:
      "Have a project or task? Submit it here for analysis and routing to our talent network.",
    icon: Briefcase,
  },
];

const networkLinks: { title: string; href: string; description: string, icon: LucideIcon }[] = [
    {
    title: "Become a Partner",
    href: "/partner",
    description:
      "Join our network of freelancers, subcontractors, and service providers.",
    icon: Handshake,
  },
  {
    title: "Invest With Us",
    href: "/invest",
    description:
      "Explore investment opportunities and be part of our innovation journey.",
    icon: FileText,
  },
];


export default function Header() {
  const pathname = usePathname();
  const { settings } = useSettingsData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
  
  if (!isClient) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
             <div className="container flex h-20 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                <Image src="https://storage.googleapis.com/stella-images/studio-app-live/20240801-140026-646-logo.png" alt="Innovative Enterprises Logo" width={160} height={40} className="w-40 h-auto object-contain" />
                </Link>
             </div>
        </header>
    );
  }

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
                <NavigationMenuTrigger className="text-base font-medium">
                    <Sparkles className="mr-2 h-4 w-4" /> Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className={cn("grid gap-x-6 gap-y-4 p-6", `grid-cols-${settings.servicesMenuColumns} w-[${settings.servicesMenuColumns * 300}px]`)}>
                    {solutionsByCategory.map((category) => (
                        <div key={category.category} className="flex flex-col">
                            <h3 className="mb-3 text-sm font-semibold text-foreground px-3">{category.category}</h3>
                            <ul className="flex flex-col gap-1">
                                {category.items.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                    onClick={handleLinkClick}
                                    icon={component.icon}
                                >
                                    {component.description}
                                </ListItem>
                                ))}
                            </ul>
                        </div>
                    ))}
                   </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">Opportunities</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[600px] grid-cols-2 gap-3 p-4">
                    {opportunitiesLinks.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                        onClick={handleLinkClick}
                        icon={component.icon}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
               <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">Network</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[600px] grid-cols-2 gap-3 p-4">
                    {networkLinks.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                        onClick={handleLinkClick}
                        icon={component.icon}
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
                <SheetContent side="right" className="w-[300px] sm:w-[340px]">
                 <SheetHeader className="p-4 border-b">
                    <SheetTitle>
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary" onClick={handleLinkClick}>
                            <Image src="https://storage.googleapis.com/stella-images/studio-app-live/20240801-140026-646-logo.png" alt="Innovative Enterprises Logo" width={160} height={40} className="w-40 h-auto object-contain" />
                        </Link>
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        Main navigation menu.
                    </SheetDescription>
                 </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    <div className="flex flex-col gap-4 py-4">
                        <nav className="flex flex-col gap-2 px-2">
                        {mobileNavLinks}

                        {solutionsByCategory.map((category) => (
                            <div key={category.category} className="mt-4">
                                <p className="px-3 pt-4 pb-2 text-sm font-semibold text-muted-foreground">{category.category}</p>
                                {category.items.map((link) => (
                                    <Button
                                    key={link.href}
                                    asChild
                                    variant="ghost"
                                    className={cn("justify-start text-base", pathname === link.href && 'bg-primary/10 text-primary')}
                                    onClick={handleLinkClick}
                                    >
                                    <Link href={link.href}><link.icon className="mr-2 h-4 w-4"/>{link.title}</Link>
                                    </Button>
                                ))}
                            </div>
                        ))}
                        
                        <p className="px-3 pt-4 pb-2 text-sm font-semibold text-muted-foreground">Opportunities</p>
                        {opportunitiesLinks.map((link) => (
                            <Button
                            key={link.href}
                            asChild
                            variant="ghost"
                            className="justify-start text-base"
                            onClick={handleLinkClick}
                            >
                            <Link href={link.href}><link.icon className="mr-2 h-4 w-4"/>{link.title}</Link>
                            </Button>
                        ))}
                        <p className="px-3 pt-4 pb-2 text-sm font-semibold text-muted-foreground">Network</p>
                        {networkLinks.map((link) => (
                            <Button
                            key={link.href}
                            asChild
                            variant="ghost"
                            className="justify-start text-base"
                            onClick={handleLinkClick}
                            >
                            <Link href={link.href}><link.icon className="mr-2 h-4 w-4"/>{link.title}</Link>
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
                        <Button className="mt-4 mx-4">Log Out</Button>
                    </div>
                </ScrollArea>
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
  React.ComponentPropsWithoutRef<"a"> & { icon?: LucideIcon }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
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
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            {Icon && <Icon className="h-5 w-5 text-primary/80" />}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground pl-7">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
