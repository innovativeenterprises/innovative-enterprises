
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
  Lightbulb,
  FileText,
  Briefcase,
  Handshake,
  DollarSign,
  GanttChartSquare,
  PanelLeft,
  FolderKanban,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { href: '/admin/content', label: 'Site Content', icon: FileText },
    { href: '/admin/people', label: 'People & Network', icon: Handshake },
    { href: '/admin/operations', label: 'Operations', icon: GanttChartSquare },
  ];

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <Button asChild variant="ghost" className="h-auto w-auto p-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Lightbulb className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
                Innovative
              </span>
            </Link>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
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
                 <SidebarMenuButton asChild tooltip={{ children: 'Settings', side: 'right', align: 'center' }}>
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
        <main className="p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
