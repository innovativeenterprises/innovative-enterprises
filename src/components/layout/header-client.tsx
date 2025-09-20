
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu, User, Briefcase, ShoppingCart, Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect, useMemo, forwardRef } from 'react';
import { useTheme } from 'next-themes';
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
import { useCartData, useSolutionsData, useIndustriesData, useAiToolsData } from '@/hooks/use-global-store-data';
import { ScrollArea } from '../ui/scroll-area';
import type { Solution, Industry, AiTool } from '@/lib/nav-links';


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


export default function HeaderClient() { 
  const { solutions } = useSolutionsData();
  const { industries } = useIndustriesData();
  const { aiTools } = useAiToolsData();

  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, isClient } = useCartData();
  const { theme, setTheme } = useTheme();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };
  
    const navLinks = [
        { href: "/about", label: "About" },
        { href: "/invest", label: "Invest" },
        { href: "/partner", label: "Partners" },
    ];
    
    const solutionsByCategory = {
        "SaaS Platforms": solutions,
        "AI Tools": aiTools,
    }

    const industriesByCategory = {
        "Industries": industries,
    }
  
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
          <Image src="/logo.png" alt="INNOVATIVE ENTERPRISES Logo" width={160} height={40} className="w-40 h-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-1">
           <NavigationMenu>
            <NavigationMenuList>
              {renderNavLinks()}
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
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
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
