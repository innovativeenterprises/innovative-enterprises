
export interface CommunityMember {
    id: string;
    communityId: string;
    name: string;
    photo: string;
    position?: string;
    employer?: string;
    status: 'Active' | 'Inactive';
}

export const initialMembers: CommunityMember[] = [
    { id: 'mem_01', communityId: 'comm_01', name: 'Nasser Al-Busaidi', photo: 'https://i.pravatar.cc/100?img=12', position: 'President', employer: 'University of Oxford', status: 'Active' },
    { id: 'mem_02', communityId: 'comm_01', name: 'Aisha Al-Riyami', photo: 'https://i.pravatar.cc/100?img=15', position: 'Student', employer: 'University of Manchester', status: 'Active' },
    { id: 'mem_03', communityId: 'comm_02', name: 'Rajesh Kumar', photo: 'https://i.pravatar.cc/100?img=22', position: 'Chairman', employer: 'Self-employed', status: 'Active' },
];

