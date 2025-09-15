
'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Briefcase, Calendar, GraduationCap, HandCoins, Search, Building2, User, MapPin } from "lucide-react";
import Link from "next/link";
import { initialMembers, type CommunityMember } from '@/lib/community-members';
import { initialEvents, type CommunityEvent } from '@/lib/community-events';
import { initialJobs, type JobPosting } from '@/lib/alumni-jobs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import type { Metadata } from 'next';

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
    const [searchTerm, setSearchTerm] = useState('');
    
    // In a real app, this data would be fetched from an API
    const alumni = initialMembers.filter(m => m.status === 'Active');
    const events = initialEvents.slice(0, 3);
    const jobs = initialJobs.slice(0, 3);

    const filteredAlumni = useMemo(() => {
        if (!searchTerm) return alumni.slice(0, 4);
        return alumni.filter(a => 
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.position && a.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (a.employer && a.employer.toLowerCase().includes(searchTerm.toLowerCase()))
        ).slice(0, 4);
    }, [alumni, searchTerm]);

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
                         <div className="relative pt-2">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, position, or company..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        {filteredAlumni.map(member => <MemberCard key={member.id} member={member} />)}
                    </CardContent>
                    <CardFooter>
                         <Button variant="outline" className="w-full">View Full Directory</Button>
                    </CardFooter>
                </Card>

                 {/* Events */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5"/> Upcoming Events</CardTitle>
                        <CardDescription>Join our upcoming alumni meetups and networking events.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {events.map(event => <EventCard key={event.id} event={event} />)}
                    </CardContent>
                     <CardFooter>
                         <Button variant="outline" className="w-full">View All Events</Button>
                    </CardFooter>
                </Card>

                {/* Job Board */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5"/> Job Board</CardTitle>
                        <CardDescription>Explore opportunities from our partner network.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {jobs.map(job => <JobCard key={job.id} job={job} />)}
                    </CardContent>
                     <CardFooter>
                         <Button variant="outline" className="w-full">View All Jobs</Button>
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
                             <Progress value={62.8} className="mt-2 h-3"/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-accent hover:bg-accent/90">Donate Now</Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader>
                         <CardTitle className="text-lg">Are You an Employer?</CardTitle>
                         <CardDescription>Post a job to our network of talented alumni.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button className="w-full" variant="secondary">Post a Job</Button>
                    </CardFooter>
                 </Card>
            </div>
        </div>

      </div>
    </div>
    );
}
