
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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator
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
  BrainCircuit,
  Warehouse,
  Trophy,
  Gift,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';


export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const dashboards = [
      { href: '/admin', label: 'Main Dashboard', icon: LayoutDashboard },
      { href: '/admin/coo-dashboard', label: 'AI COO', icon: BrainCircuit },
  ];

  const contentManagement = [
      { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
      { href: '/admin/saas-portfolio', label: 'SaaS Portfolio', icon: Package },
      { href: '/admin/opportunities', label: 'Opportunities', icon: Trophy },
      { href: '/admin/content', label: 'Site Content', icon: FileText },
  ];
  
  const networkAndPeople = [
      { href: '/admin/network', label: 'Partner Network', icon: Network },
      { href: '/admin/people', label: 'People', icon: UserCog },
      { href: '/community-hub/membership', label: 'Communities', icon: Handshake },
  ];
  
  const operations = [
      { href: '/admin/finance', label: 'Finance', icon: WalletCards },
      { href: '/admin/operations', label: 'Operations & AI', icon: GanttChartSquare },
      { href: '/admin/real-estate', label: 'Real Estate', icon: Building2 },
      { href: '/admin/stock-clear', label: 'StockClear', icon: Warehouse },
      { href: '/admin/hadeeya', label: 'Hadeeya Gift Cards', icon: Gift },
  ];


  const renderMenuItem = (item: { href: string; label: string; icon: React.ElementType }) => (
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
  );

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <Button asChild variant="ghost" className="h-auto w-auto p-1">
            <Link href="/admin" className="flex items-center gap-2">
               <Image src="/logo.png" alt="Innovative Enterprises Logo" width={160} height={40} className="w-32 h-auto object-contain group-data-[collapsible=icon]:hidden" priority />
               <Image src="/icon.png" alt="Innovative Enterprises Logo" width={32} height={32} className="w-8 h-8 object-contain hidden group-data-[collapsible=icon]:block" priority />
            </Link>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarGroup>
                <SidebarGroupLabel>Dashboards</SidebarGroupLabel>
                {dashboards.map(renderMenuItem)}
            </SidebarGroup>
             <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>Content</SidebarGroupLabel>
                {contentManagement.map(renderMenuItem)}
            </SidebarGroup>
            <SidebarSeparator />
             <SidebarGroup>
                <SidebarGroupLabel>Network & People</SidebarGroupLabel>
                {networkAndPeople.map(renderMenuItem)}
            </SidebarGroup>
             <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>Operations</SidebarGroupLabel>
                {operations.map(renderMenuItem)}
            </SidebarGroup>
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
