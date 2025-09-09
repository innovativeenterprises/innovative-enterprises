
'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  FolderKanban,
  WalletCards,
  Network,
  Zap,
  GanttChartSquare,
  Home,
  Building2,
  UserCog,
  Handshake,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { href: '/admin/finance', label: 'Finance', icon: WalletCards },
    { href: '/admin/content', label: 'Site Content', icon: FileText },
    { href: '/admin/network', label: 'Network', icon: Network },
    { href: '/admin/people', label: 'People', icon: UserCog },
    { href: '/admin/communities', label: 'Communities', icon: Handshake },
    { href: '/admin/real-estate', label: 'Real Estate', icon: Building2 },
    { href: '/admin/operations', label: 'Operations', icon: GanttChartSquare },
  ];

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <Button asChild variant="ghost" className="h-auto w-auto p-1">
            <Link href="/admin" className="flex items-center gap-2">
               <Image src="https://storage.googleapis.com/stella-images/studio-app-live/20240801-140026-646-logo.png" alt="Innovative Enterprises Logo" width={160} height={40} className="w-32 h-auto object-contain group-data-[collapsible=icon]:hidden" />
               <Image src="https://storage.googleapis.com/stella-images/studio-app-live/20240730-192534-315-lightbulb_logo.png" alt="Innovative Enterprises Logo" width={32} height={32} className="w-8 h-8 object-contain hidden group-data-[collapsible=icon]:block" />
            </Link>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin')}
                  tooltip={{
                    children: item.label,
                    side: 'right',
                    align: 'center',
                  }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: 'View Live Site', side: 'right', align: 'center' }}>
                     <Link href="/"><Home /><span>View Live Site</span></Link>
                 </SidebarMenuButton>
             </SidebarMenuItem>
             <SidebarMenuItem>
                 <SidebarMenuButton asChild tooltip={{ children: 'Settings', side: 'right', align: 'center' }} isActive={pathname === '/admin/settings'}>
                     <Link href="/admin/settings"><Settings /><span>Settings</span></Link>
                 </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-sm md:h-16 md:px-6">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
           <div className="hidden text-xl font-medium md:block">
            Admin Dashboard
           </div>
          <div className="flex items-center gap-4">
             <Button variant="outline" asChild>
                <Link href="/">View Live Site</Link>
             </Button>
          </div>
        </header>
        <main className="p-4 md:p-8 flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
