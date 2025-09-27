
'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu, User, Briefcase, ShoppingCart, Moon, Sun, Search } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"
import React from 'react';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Solution, Industry, AiTool } from '@/lib/nav-links';
import MobileNavLinks from './mobile-nav-links';
import DesktopNavLinks from './desktop-nav-links';
import type { AppSettings } from '@/lib/settings';
import * as Icons from 'lucide-react';
import { useCartData, useAiToolsData, useSolutionsData, useIndustriesData, useSettingsData } from '@/hooks/use-data-hooks';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { iconName: string; title: string }
>(({ className, title, children, iconName, ...props }, ref) => {
  const Icon = (Icons as any)[iconName] || Icons.HelpCircle;
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
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

const CartButton = () => {
    const { data: cart } = useCartData();
    const itemCount = useMemo(() => (cart || []).reduce((sum, item) => sum + item.quantity, 0), [cart]);

    return (
        <Button variant="outline" size="icon" asChild>
            <Link href="/ecommerce/cart" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">{itemCount}</span>
                )}
                <span className="sr-only">Shopping Cart</span>
            </Link>
        </Button>
    )
}

export default function HeaderClient() { 
  const { data: solutions } = useSolutionsData();
  const { data: industries } = useIndustriesData();
  const { data: aiTools } = useAiToolsData();
  const { data: settings } = useSettingsData();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };
  
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          {settings?.headerImageUrl ? (
            <Image src={settings.headerImageUrl} alt="INNOVATIVE ENTERPRISES Logo" width={160} height={40} className="w-40 h-auto object-contain" priority />
          ) : (
            <span>INNOVATIVE ENTERPRISES</span>
          )}
        </Link>
        <nav className="hidden md:flex items-center gap-1">
           <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className={cn("grid w-[400px] gap-3 p-4", settings && settings.servicesMenuColumns === 2 && "md:w-[500px] md:grid-cols-2", settings && settings.servicesMenuColumns >= 3 && "md:w-[600px] md:grid-cols-3")}>
                    {(solutions || []).map((component) => (
                       <Link href={component.href} key={component.title} legacyBehavior passHref>
                          <ListItem
                            title={component.title}
                            iconName={component.icon}
                          >
                            {component.description}
                          </ListItem>
                        </Link>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">Industries</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {(industries || []).map((component) => (
                      <Link href={component.href} key={component.title} legacyBehavior passHref>
                          <ListItem
                            title={component.title}
                            iconName={component.icon}
                          >
                            {component.description}
                          </ListItem>
                        </Link>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
               <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">AI Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className={cn("grid w-[400px] gap-3 p-4", settings && settings.aiToolsMenuColumns === 2 && "md:w-[500px] md:grid-cols-2", settings && settings.aiToolsMenuColumns >= 3 && "md:w-[600px] md:grid-cols-3", settings && settings.aiToolsMenuColumns >= 4 && "lg:w-[800px] lg:grid-cols-4")}>
                    {(aiTools || []).map((component) => (
                       <Link href={component.href} key={component.title} legacyBehavior passHref>
                          <ListItem
                            title={component.title}
                            iconName={component.icon}
                          >
                            {component.description}
                          </ListItem>
                        </Link>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
                <DesktopNavLinks />
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <div className="flex items-center gap-2">
            <CartButton />
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
                             {settings?.headerImageUrl ? (
                                <Image src={settings.headerImageUrl} alt="INNOVATIVE ENTERPRISES Logo" width={160} height={40} className="w-40 h-auto object-contain" priority />
                            ) : (
                                <span>INNOVATIVE ENTERPRISES</span>
                            )}
                        </Link>
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        Main navigation menu.
                    </SheetDescription>
                 </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    <div className="flex flex-col gap-4 py-4">
                        <nav className="flex flex-col gap-2 px-2">
                        <p className="px-3 pt-4 pb-2 text-sm font-semibold text-muted-foreground">Main Menu</p>
                        <MobileNavLinks handleLinkClick={handleLinkClick} />
                        
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
