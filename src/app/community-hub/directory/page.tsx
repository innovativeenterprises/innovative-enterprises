
'use client';

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Users, Search, SlidersHorizontal, Mail, Linkedin, Phone } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import type { CommunityMember } from '@/lib/community-members';
import { useMembersData, useCommunitiesData } from '@/hooks/use-global-store-data';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const MemberCard = ({ member }: { member: CommunityMember }) => (
    <Card>
        <CardContent className="p-4 flex items-center gap-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src={member.photo} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.position}</p>
                <p className="text-xs text-muted-foreground">{member.employer}</p>
                 <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="icon" className="h-7 w-7"><Mail className="h-4 w-4"/></Button>
                    <Button variant="outline" size="icon" className="h-7 w-7"><Linkedin className="h-4 w-4"/></Button>
                    <Button variant="outline" size="icon" className="h-7 w-7"><Phone className="h-4 w-4"/></Button>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function MemberDirectoryPage() {
    const { members, setMembers, isClient } = useMembersData();
    const { communities } = useCommunitiesData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCommunity, setSelectedCommunity] = useState('All');
    
    useEffect(() => {
        // Since we removed server-side fetching for this, we ensure data is present on client-side mount
        // This is a pattern for client-heavy pages.
        if (isClient) {
            // In a real app, you might fetch initial data here if it wasn't pre-loaded
            // For now, it's loaded from the store's initial state
        }
    }, [isClient]);

    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            const matchesCommunity = selectedCommunity === 'All' || member.communityId === selectedCommunity;
            const matchesSearch = searchTerm === '' ||
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.employer?.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesCommunity && matchesSearch && member.status === 'Active';
        });
    }, [members, searchTerm, selectedCommunity]);

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                 <div className="max-w-5xl mx-auto space-y-8">
                     <div>
                        <Button asChild variant="outline" className="mb-4">
                            <Link href="/community-hub">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Community Hub
                            </Link>
                        </Button>
                        <div className="text-center">
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                <Users className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-primary">Member Directory</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                               Connect with members from your community.
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Directory</CardTitle>
                             <div className="flex flex-col md:flex-row gap-4 pt-2">
                                <div className="relative flex-grow">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name, position, or company..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                                    <SelectTrigger className="w-full md:w-[280px]">
                                        <SelectValue placeholder="Filter by community..."/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Communities</SelectItem>
                                        {communities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {!isClient ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />) :
                                    filteredMembers.map(member => (
                                        <MemberCard key={member.id} member={member} />
                                    ))
                                }
                            </div>
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </div>
    );
}
