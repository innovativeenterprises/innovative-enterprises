'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu, Sparkles, User, Briefcase, ShoppingCart, Handshake, Building, Shield, Server, Video, ServerCog, Lightbulb, UserRoundCheck, Mic, FileText, Languages, Scale, Trophy, Cpu, Search, BrainCircuit, HardHat, Building2, GraduationCap, Users, Store, BarChart3, GitBranch, Gem, MessageSquareQuote, Bot, MessageSquare, Car, Award, Warehouse, Truck, ImageIcon, MapPin, Gift, VrHeadset, Layers, Home, Heart, BookUser, Recycle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect, useMemo } from 'react';
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
import { useCartData, useSettingsData } from '@/hooks/use-global-store-data';
import { ScrollArea } from '../ui/scroll-area';
import SanadHubIcon from '../icons/sanad-hub-icon';
import BusinessHubIcon from '../icons/business-hub-icon';
import AmeenSmartLockIcon from '../icons/ameen-smart-lock-icon';
import KhidmaIcon from '../icons/khidma-icon';
import VmallIcon from '../icons/vmall-icon';
import AppiIcon from '../icons/appi-icon';
import type { AppSettings } from '@/lib/settings';

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ElementType }
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


export default function HeaderClient({ navLinks, settings, solutionsByCategory, industriesByCategory }: {
    navLinks: { href: string; label: string }[],
    settings: AppSettings,
    solutionsByCategory: Record<string, any[]>,
    industriesByCategory: Record<string, any[]>
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, isClient } = useCartData();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const opportunitiesLinks: { title: string; href: string; description: string, icon: React.ElementType }[] = [
    {
        title: "Competitions & Opportunities",
        href: "/opportunities",
        description:
            "View open competitions and tasks for our network of freelancers and partners.",
        icon: Trophy,
    },
    {
        title: "Submit an Idea",
        href: "/submit-work",
        description:
        "Have a project or startup idea? Submit it to our e-incubator for analysis and potential sponsorship.",
        icon: Lightbulb,
    },
    ];

    const networkLinks: { title: string; href: string; description: string, icon: React.ElementType }[] = [
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
    {
        title: "Partner Rewards",
        href: "/partner/rewards",
        description:
        "View the welcome kits, digital certificates, and badges available to our valued partners.",
        icon: Award,
    },
    ];
  
  if (!isClient) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
             <div className="container flex h-20 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                <Image src="/logo.png" alt="INNOVATIVE ENTERPRISES Logo" width={160} height={40} className="w-40 h-auto object-contain" priority />
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
          <Image src="/logo.png" alt="INNOVATIVE ENTERPRISES Logo" width={160} height={40} className="w-40 h-auto object-contain" priority />
        </Link>
        <nav className="hidden md:flex items-center gap-1">
           <NavigationMenu>
            <NavigationMenuList>
              {renderNavLinks()}
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
                            <Image src="/logo.png" alt="INNOVATIVE ENTERPRISES Logo" width={160} height={40} className="w-40 h-auto object-contain" />
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

                        {Object.entries(solutionsByCategory).map(([category, items]) => (
                            <div key={category} className="mt-4">
                                <p className="px-3 pt-4 pb-2 text-sm font-semibold text-muted-foreground">{category}</p>
                                {(items as any[]).map((link) => (
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
