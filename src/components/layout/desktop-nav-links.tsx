
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils';

export default function DesktopNavLinks() {
  const pathname = usePathname();
  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/invest", label: "Invest" },
    { href: "/partner", label: "Partners" },
  ];

  return (
    <>
      {navLinks.map((link) => (
        <NavigationMenuItem key={link.href}>
          <Link href={link.href} passHref asChild>
            <NavigationMenuLink active={pathname === link.href} className={cn(navigationMenuTriggerStyle(), 'text-base font-medium')}>
                {link.label}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
    </>
  );
};
