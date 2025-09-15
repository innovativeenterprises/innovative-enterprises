
export interface Client {
    id: string;
    name: string;
    logo: string;
    aiHint: string;
}

export interface Testimonial {
    id: string;
    quote: string;
    author: string;
    company: string;
    avatarId: string;
}

export const initialClients: Client[] = [
    { id: 'client_1', name: "Oman Government Partner 1", logo: "https://placehold.co/150x60.png", aiHint: "government building" },
    { id: 'client_2', name: "Oman Government Partner 2", logo: "https://placehold.co/150x60.png", aiHint: "oman flag" },
    { id: 'client_3', name: "Key Partner 1", logo: "https://placehold.co/150x60.png", aiHint: "corporate logo" },
    { id: 'client_4', name: "Key Partner 2", logo: "https://placehold.co/150x60.png", aiHint: "tech company" },
    { id: 'client_5', name: "Key Partner 3", logo: "https://placehold.co/150x60.png", aiHint: "finance building" },
    { id: 'client_6', name: "Key Partner 4", logo: "https://placehold.co/150x60.png", aiHint: "abstract logo" },
];

export const initialTestimonials: Testimonial[] = [
    {
        id: 'test_1',
        quote: "Innovative Enterprises has been a pivotal partner in our digital transformation journey. Their expertise and commitment are unparalleled.",
        author: "Director General",
        company: "Government Entity",
        avatarId: "gov1",
    },
    {
        id: 'test_2',
        quote: "The solutions provided by Innovative Enterprises have significantly improved our operational efficiency. Their team is professional and highly skilled.",
        author: "CEO",
        company: "Leading Corporation",
        avatarId: "corp1",
    },
    {
        id: 'test_3',
        quote: "The **Business Hub** was instrumental in finding our first major client. A fantastic platform for Omani startups.",
        author: "Founder & CEO",
        company: "Tech Innovators Oman",
        avatarId: "startup1",
    },
    {
        id: 'test_4',
        quote: "Thanks to the **GENIUS** platform, I revamped my CV and landed a dream contract. The **AI interview coach** was a game-changer.",
        author: "Ali Al-Saidi",
        company: "Freelance Software Engineer",
        avatarId: "freelancer1",
    },
    {
        id: 'test_5',
        quote: "**Voxi Translator** handles our legal document translations with impressive accuracy and speed. It's an essential tool for our cross-border cases.",
        author: "Senior Partner",
        company: "Muscat Legal Associates",
        avatarId: "legal1",
    },
    {
        id: 'test_6',
        quote: "Joining the **Sanad Hub** doubled our monthly client requests. The platform is easy to use and has professionalized our operations.",
        author: "Owner",
        company: "Al Amerat Sanad Services",
        avatarId: "sanad1",
    },
    {
        id: 'test_7',
        quote: "The **AI Property Valuator** gave us a fast and surprisingly accurate estimate, saving us days of manual work.",
        author: "Property Manager",
        company: "Al Mouj Residences",
        avatarId: "prop1",
    },
    {
        id: 'test_8',
        quote: "**RAAHA's** white-label platform has modernized our agency, allowing us to manage candidates and clients more effectively than ever before.",
        author: "Managing Director",
        company: "Happy Homes Agency",
        avatarId: "raaha1",
    },
    {
        id: 'test_9',
        quote: "Using the **AI Tender Response Assistant**, we've cut down our proposal drafting time by more than 60%. Highly recommended.",
        author: "Bidding Manager",
        company: "Galfar Engineering & Contracting",
        avatarId: "tender1",
    },
    {
        id: 'test_10',
        quote: "**InfraRent** provided the exact IT hardware we needed for our developer workshop on very short notice. The process was seamless.",
        author: "Event Coordinator",
        company: "Oman Tech Events",
        avatarId: "infra1",
    }
];
