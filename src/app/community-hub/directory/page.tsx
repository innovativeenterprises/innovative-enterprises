
'use client';

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Users, Search, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useMembersData } from '@/app/community-hub/membership/page';
import type { CommunityMember } from "@/lib/community-members";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const MemberCard = ({ member }: { member: CommunityMember }) => {
    return (
        <Card className="flex flex-col text-center items-center p-6">
            <Image src={member.photo} alt={member.name} width={96} height={96} className="rounded-full object-cover border-4 border-primary/20" />
            <CardTitle className="mt-4 text-xl">{member.nickname || member.name}</CardTitle>
            <CardDescription>{member.memberType}</CardDescription>
            <CardContent className="p-0 mt-4 flex-grow">
                 <Badge variant="outline">Joined: {new Date(member.joinDate).toLocaleDateString()}</Badge>
            </CardContent>
            <CardFooter className="p-0 mt-4">
                 <a href={`mailto:${member.contact}`} className="text-muted-foreground hover:text-primary"><Mail className="h-5 w-5"/></a>
            </CardFooter>
        </Card>
    )
}

export default function MemberDirectoryPage() {
    const { members } = useMembersData();
    const [searchTerm, setSearchTerm] = useState('');
    
    const activeMembers = useMemo(() => {
        return members.filter(member => 
            member.status === 'Active' &&
            (member.name.toLowerCase().includes(searchTerm.toLowerCase()) || (member.nickname && member.nickname.toLowerCase().includes(searchTerm.toLowerCase())))
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
                    placeholder="Search by name or nickname..."
                    className="w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {activeMembers.map(member => (
                    <MemberCard key={member.id} member={member} />
                ))}
            </div>

        </div>
      </div>
    </div>
    )
}
