
'use client';

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Users, Search, Mail, Phone, Home, User } from "lucide-react";
import Link from "next/link";
import { useMembersData } from '@/app/community-hub/membership/page';
import type { CommunityMember } from "@/lib/community-members";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const FamilyCard = ({ familyHead, members }: { familyHead: CommunityMember, members: CommunityMember[] }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start gap-4 bg-muted/50">
                 <Image src={familyHead.photo} alt={familyHead.name} width={64} height={64} className="rounded-full object-cover border-2 border-primary/20" />
                 <div>
                    <CardTitle className="text-xl">{familyHead.nickname || familyHead.name}'s Family</CardTitle>
                    <CardDescription>{familyHead.address || 'Address not specified'}</CardDescription>
                 </div>
            </CardHeader>
            <CardContent className="p-4">
                 <div className="space-y-3">
                    {[familyHead, ...members].map(member => (
                         <div key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                            <div className="flex items-center gap-3">
                                 <User className="h-4 w-4 text-muted-foreground"/>
                                 <div>
                                     <p className="font-medium text-sm">{member.nickname || member.name}</p>
                                     <p className="text-xs text-muted-foreground">{member.householdRole === 'Head' ? 'Head of Family' : member.householdRole}</p>
                                 </div>
                            </div>
                            <a href={`mailto:${member.contact}`} className="text-muted-foreground hover:text-primary"><Mail className="h-5 w-5"/></a>
                        </div>
                    ))}
                 </div>
            </CardContent>
        </Card>
    )
}

const FamilyGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
                <CardHeader className="flex flex-row items-start gap-4 bg-muted/50">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </CardContent>
            </Card>
        ))}
    </div>
);

export default function MemberDirectoryPage() {
    const { members } = useMembersData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const families = useMemo(() => {
        const familyMap: Record<string, { head: CommunityMember, members: CommunityMember[] }> = {};
        
        const activeMembers = members.filter(m => m.status === 'Active');

        // First, find all heads of families
        activeMembers.forEach(member => {
            if (member.householdRole === 'Head' && member.familyId) {
                familyMap[member.familyId] = { head: member, members: [] };
            }
        });
        
        // Then, assign other members to their families
        activeMembers.forEach(member => {
            if (member.householdRole !== 'Head' && member.familyId && familyMap[member.familyId]) {
                familyMap[member.familyId].members.push(member);
            }
        });

        const familyArray = Object.values(familyMap);

        if (!searchTerm) {
            return familyArray;
        }

        const lowercasedFilter = searchTerm.toLowerCase();
        return familyArray.filter(({ head, members }) => 
            head.name.toLowerCase().includes(lowercasedFilter) ||
            (head.nickname && head.nickname.toLowerCase().includes(lowercasedFilter)) ||
            members.some(m => m.name.toLowerCase().includes(lowercasedFilter) || (m.nickname && m.nickname.toLowerCase().includes(lowercasedFilter)))
        );

    }, [members, searchTerm]);

    return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/community-hub"><ArrowLeft className="mr-2 h-4 w-4" />Back to Community Hub</Link>
                </Button>
                <div className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Users className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Community Directory</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                       Connect with fellow members of your community.
                    </p>
                </div>
            </div>

            <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by family or member name..."
                    className="w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {isClient ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {families.map(({ head, members }) => (
                        <FamilyCard key={head.familyId} familyHead={head} members={members} />
                    ))}
                </div>
            ) : (
                <FamilyGridSkeleton />
            )}

        </div>
      </div>
    </div>
    )
}
