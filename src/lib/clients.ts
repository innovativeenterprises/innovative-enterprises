
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
    },
    {
        id: 'test_2',
        quote: "The solutions provided by Innovative Enterprises have significantly improved our operational efficiency. Their team is professional and highly skilled.",
        author: "CEO",
        company: "Leading Corporation",
    },
];
