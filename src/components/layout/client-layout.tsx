

'use client';

import { Toaster } from '@/components/ui/toaster';
import ChatWidget from '@/components/chat-widget';
import { ThemeProvider } from 'next-themes';
import Footer from './footer';
import Header from './header';
import type { Solution, Industry, AiTool } from '@/lib/nav-links';
import React, { createContext, useState, type ReactNode, useEffect } from 'react';
import type { AppState } from '@/lib/initial-state';
import { store } from '@/lib/global-store';
import { initialBriefcase } from '@/lib/briefcase';
import { initialRaahaAgencies } from '@/lib/raaha-agencies';
import { initialRaahaWorkers } from '@/lib/raaha-workers';
import { initialStairspaceListings } from '@/lib/stairspace-listings';
import { initialUsedItems } from '@/lib/used-items';
import { initialLeases } from '@/lib/leases';
import { initialStudents } from '@/lib/students';
import { initialEvents } from '@/lib/community-events';
import { initialAlumniJobs } from '@/lib/alumni-jobs';
import { initialMembers } from '@/lib/community-members';

export const CartContext = createContext<{
  cart: AppState['cart'];
  setCart: React.Dispatch<React.SetStateAction<AppState['cart']>>;
} | null>(null);

export const BriefcaseContext = React.createContext<{
  briefcase: AppState['briefcase'];
  setBriefcase: React.Dispatch<React.SetStateAction<AppState['briefcase']>>;
} | null>(null);

export const AgenciesContext = React.createContext<{
  agencies: AppState['raahaAgencies'];
  setAgencies: React.Dispatch<React.SetStateAction<AppState['raahaAgencies']>>;
} | null>(null);

export const WorkersContext = React.createContext<{
  workers: AppState['raahaWorkers'];
  setWorkers: React.Dispatch<React.SetStateAction<AppState['raahaWorkers']>>;
} | null>(null);

export const StairspaceContext = React.createContext<{
  stairspaceListings: AppState['stairspaceListings'];
  setStairspaceListings: React.Dispatch<React.SetStateAction<AppState['stairspaceListings']>>;
} | null>(null);

export const UsedItemsContext = React.createContext<{
  items: AppState['usedItems'];
  setItems: React.Dispatch<React.SetStateAction<AppState['usedItems']>>;
} | null>(null);

export const LeasesContext = React.createContext<{
  leases: AppState['signedLeases'];
  setLeases: React.Dispatch<React.SetStateAction<AppState['signedLeases']>>;
} | null>(null);

export const StudentsContext = React.createContext<{
  students: AppState['students'];
  setStudents: React.Dispatch<React.SetStateAction<AppState['students']>>;
} | null>(null);

export const EventsContext = React.createContext<{
  events: AppState['communityEvents'];
  setEvents: React.Dispatch<React.SetStateAction<AppState['communityEvents']>>;
} | null>(null);

export const JobsContext = React.createContext<{
  jobs: AppState['alumniJobs'];
  setJobs: React.Dispatch<React.SetStateAction<AppState['alumniJobs']>>;
} | null>(null);

export const MembersContext = React.createContext<{
  members: AppState['communityMembers'];
  setMembers: React.Dispatch<React.SetStateAction<AppState['communityMembers']>>;
} | null>(null);


export default function ClientLayout({
  children,
  solutions,
  industries,
  aiTools,
  settings,
}: {
  children: React.ReactNode;
  solutions: Solution[];
  industries: Industry[];
  aiTools: AiTool[];
  settings: AppState['settings'];
}) {
  const [cart, setCart] = useState<AppState['cart']>([]);
  const [briefcase, setBriefcase] = useState<AppState['briefcase']>(initialBriefcase);
  const [agencies, setAgencies] = useState<AppState['raahaAgencies']>(initialRaahaAgencies);
  const [workers, setWorkers] = useState<AppState['raahaWorkers']>(initialRaahaWorkers);
  const [stairspaceListings, setStairspaceListings] = useState<AppState['stairspaceListings']>(initialStairspaceListings);
  const [items, setItems] = useState<AppState['usedItems']>(initialUsedItems);
  const [leases, setLeases] = useState<AppState['signedLeases']>(initialLeases);
  const [students, setStudents] = useState<AppState['students']>(initialStudents);
  const [events, setEvents] = useState<AppState['communityEvents']>(initialEvents);
  const [jobs, setJobs] = useState<AppState['alumniJobs']>(initialAlumniJobs);
  const [members, setMembers] = useState<AppState['communityMembers']>(initialMembers);

  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
      <CartContext.Provider value={{ cart, setCart }}>
      <BriefcaseContext.Provider value={{ briefcase, setBriefcase }}>
      <AgenciesContext.Provider value={{ agencies, setAgencies }}>
      <WorkersContext.Provider value={{ workers, setWorkers }}>
      <StairspaceContext.Provider value={{ stairspaceListings, setStairspaceListings }}>
      <UsedItemsContext.Provider value={{ items, setItems }}>
      <LeasesContext.Provider value={{ leases, setLeases }}>
      <StudentsContext.Provider value={{ students, setStudents }}>
      <EventsContext.Provider value={{ events, setEvents }}>
      <JobsContext.Provider value={{ jobs, setJobs }}>
      <MembersContext.Provider value={{ members, setMembers }}>
        <div className="flex min-h-screen flex-col">
            <Header 
              solutions={solutions}
              industries={industries}
              aiTools={aiTools}
            />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
            <ChatWidget settings={settings} />
        </div>
      </MembersContext.Provider>
      </JobsContext.Provider>
      </EventsContext.Provider>
      </StudentsContext.Provider>
      </LeasesContext.Provider>
      </UsedItemsContext.Provider>
      </StairspaceContext.Provider>
      </WorkersContext.Provider>
      </AgenciesContext.Provider>
      </BriefcaseContext.Provider>
      </CartContext.Provider>
    </ThemeProvider>
  );
}
