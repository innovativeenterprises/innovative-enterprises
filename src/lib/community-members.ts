
export interface CommunityMember {
  id: string;
  name: string;
  nickname?: string;
  joinDate: string; // ISO Date string 'YYYY-MM-DD'
  status: 'Active' | 'Inactive' | 'Pending Review';
  householdRole: 'Head' | 'Member';
  familyId?: string; // Links members of the same family
  contact: string;
  photo: string;
  position?: string;
  employer?: string;
  address?: string;
}

export const initialMembers: CommunityMember[] = [
    {
        id: "mem_1",
        name: "Ahmed Al-Farsi",
        nickname: "Abu Abdullah",
        joinDate: "2022-01-15",
        status: "Active",
        householdRole: 'Head',
        familyId: "fam_1",
        contact: "+968 99123456",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        position: "Senior Engineer",
        employer: "Petroleum Development Oman",
        address: "Al-Khuwair, Muscat"
    },
    {
        id: "mem_2",
        name: "Fatima Al-Balushi",
        joinDate: "2022-01-15",
        status: "Active",
        householdRole: 'Member',
        familyId: "fam_1",
        contact: "fatima.b@example.com",
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
        position: "Marketing Manager",
        employer: "Omantel",
        address: "Al-Khuwair, Muscat"
    },
    {
        id: "mem_3",
        name: "John Smith",
        nickname: "John S.",
        joinDate: "2023-05-20",
        status: "Active",
        householdRole: 'Head',
        familyId: "fam_2",
        contact: "+971 50 123 4567",
        photo: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=400&auto=format&fit=crop",
        position: "Architect",
        employer: "AECOM",
        address: "Shatti Al-Qurum, Muscat"
    },
    {
        id: "mem_4",
        name: "Priya Sharma",
        joinDate: "2023-09-10",
        status: "Pending Review",
        householdRole: 'Head',
        contact: "priya.sharma@example.com",
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "mem_5",
        name: "Khaled Ibrahim",
        joinDate: "2021-11-01",
        status: "Inactive",
        householdRole: 'Head',
        familyId: "fam_3",
        contact: "+968 98765432",
        photo: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=400&auto=format&fit=crop",
        position: "Consultant",
        employer: "Self-Employed",
        address: "Madinat Al-Sultan Qaboos, Muscat"
    }
];
