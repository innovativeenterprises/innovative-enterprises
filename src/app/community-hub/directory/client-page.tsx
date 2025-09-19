
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { CommunityMember } from '@/lib/community-members';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useMembersData } from '@/hooks/use-global-store-data';

export default function MemberDirectoryClient({ initialMembers }: { initialMembers: CommunityMember[] }) {
    const { members, setMembers, isClient } = useMembersData();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setMembers(() => initialMembers);
    }, [initialMembers, setMembers]);
    
    const filteredMembers = useMemo(() => {
        if (!isClient) return [];
        if (!searchTerm) {
            return members;
        }
        return members.filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member.position && member.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (member.employer && member.employer.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [members, searchTerm, isClient]);

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
             <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                     <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">Member Directory</h1>
                        <p className="mt-4 text-lg text-muted-foreground">Connect with fellow members of your community.</p>
                    </div>
                    <Card>
                        <CardHeader>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by name, position, or company..." 
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {!isClient ? (
                                    Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-24 w-full" />)
                                ) : (
                                    filteredMembers.map(member => (
                                        <Card key={member.id} className="p-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-16 w-16">
                                                    <AvatarImage src={member.photo} alt={member.name} />
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{member.name}</p>
                                                    <p className="text-sm text-muted-foreground">{member.position}</p>
                                                    <p className="text-xs text-muted-foreground">{member.employer}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
