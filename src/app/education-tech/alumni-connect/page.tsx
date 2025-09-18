
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Briefcase, Calendar, GraduationCap, HandCoins, Building2, User, MapPin } from "lucide-react";
import Link from "next/link";
import { useMembersData, useEventsData, useAlumniJobsData } from "@/hooks/use-global-store-data";
import type { CommunityMember } from '@/lib/community-members';
import type { CommunityEvent } from '@/lib/community-events';
import type { JobPosting } from '@/lib/alumni-jobs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "AlumniConnect | Innovative Enterprises",
  description: "A comprehensive digital platform for universities to engage their alumni network, fostering connections, professional opportunities, and lifelong learning.",
};

const MemberCard = ({ member }: { member: CommunityMember }) => (
    <Card className="p-4">
        <div className="flex items-center gap-4">
            <Avatar>
                <AvatarImage src={member.photo} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.position} at {member.employer}</p>
            </div>
        </div>
    </Card>
);

const EventCard = ({ event }: { event: CommunityEvent }) => (
    <Card className="p-4">
        <p className="font-semibold">{event.title}</p>
        <div className="text-sm text-muted-foreground mt-1 flex flex-col sm:flex-row sm:gap-4">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4"/> {format(new Date(event.date), 'PPP')}</span>
            <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4"/> {event.location}</span>
        </div>
    </Card>
);

const JobCard = ({ job }: { job: JobPosting }) => (
    <Card className="p-4">
         <p className="font-semibold">{job.title}</p>
        <div className="text-sm text-muted-foreground mt-1 flex flex-col sm:flex-row sm:gap-4">
            <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4"/> {job.company}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4"/> {job.location}</span>
        </div>
    </Card>
);

export default function AlumniConnectPage() {
    const { members, isClient: isMembersClient } = useMembersData();
    const { events, isClient: isEventsClient } = useEventsData();
    const { jobs, isClient: isJobsClient } = useAlumniJobsData();
    
    const isClient = isMembersClient && isEventsClient && isJobsClient;

    const alumni = isClient ? members.filter(m => m.status === 'Active').slice(0,4) : [];
    const upcomingEvents = isClient ? events.slice(0, 3) : [];
    const jobPostings = isClient ? jobs.slice(0, 3) : [];

    return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <GraduationCap className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AlumniConnect</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A comprehensive digital platform for universities to engage their alumni network, fostering connections, professional opportunities, and lifelong learning.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mt-16 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Member Directory */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> Alumni Directory</CardTitle>
                        <CardDescription>Connect with fellow graduates.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        {!isClient ? Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-20 w-full" />) : alumni.map(member => <MemberCard key={member.id} member={member} />)}
                    </CardContent>
                    <CardFooter>
                         <Button variant="outline" className="w-full" disabled>View Full Directory (Coming Soon)</Button>
                    </CardFooter>
                </Card>

                 {/* Events */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5"/> Upcoming Events</CardTitle>
                        <CardDescription>Join our upcoming alumni meetups and networking events.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {!isClient ? Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-16 w-full" />) : upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
                    </CardContent>
                     <CardFooter>
                         <Button variant="outline" className="w-full" disabled>View All Events (Coming Soon)</Button>
                    </CardFooter>
                </Card>

                {/* Job Board */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5"/> Job Board</CardTitle>
                        <CardDescription>Explore opportunities from our partner network.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {!isClient ? Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-16 w-full" />) : jobPostings.map(job => <JobCard key={job.id} job={job} />)}
                    </CardContent>
                     <CardFooter>
                         <Button variant="outline" className="w-full" disabled>View All Jobs (Coming Soon)</Button>
                    </CardFooter>
                </Card>
            </div>
            
            <div className="lg:col-span-1 space-y-8">
                <Card className="bg-accent/10 border-accent/50">
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2 text-accent"><HandCoins className="h-5 w-5"/> Annual Giving Campaign</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <p className="text-sm text-muted-foreground">Support the next generation of students. Your contribution fuels scholarships, research, and campus development.</p>
                        <div className="pt-2">
                             <p className="text-3xl font-bold text-primary">OMR 125,670</p>
                             <p className="text-xs text-muted-foreground">raised of OMR 200,000 goal</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-accent hover:bg-accent/90" disabled>Donate Now</Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader>
                         <CardTitle className="text-lg">Are You an Employer?</CardTitle>
                         <CardDescription>Post a job to our network of talented alumni.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button className="w-full" variant="secondary" disabled>Post a Job</Button>
                    </CardFooter>
                 </Card>
            </div>
        </div>
      </div>
    </div>
    );
}
