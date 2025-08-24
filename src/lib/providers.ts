
export interface Provider {
  id: string;
  name: string;
  email: string;
  services: string;
  status: 'Vetted' | 'Pending Review' | 'On Hold';
  portfolio?: string;
  notes?: string;
}

export const initialProviders: Provider[] = [
    {
        id: "prov_1",
        name: "Creative Solutions LLC",
        email: "contact@creativesolutions.io",
        services: "Web Development, UI/UX Design",
        status: "Vetted",
        portfolio: "https://example.com",
        notes: "Reliable partner for several past projects. Excellent at React.",
    },
    {
        id: "prov_2",
        name: "Jane Doe Graphics",
        email: "jane.doe@gmail.com",
        services: "Branding, Logo Design, Illustration",
        status: "Vetted",
        portfolio: "https://example.com",
        notes: "Winner of the last re-branding competition. Great creative eye.",
    },
    {
        id: "prov_3",
        name: "Muscat Tech Experts",
        email: "info@muscat-tech.om",
        services: "IT Support, Cloud Migration",
        status: "Pending Review",
        portfolio: "https://example.com",
        notes: "New application received on 2024-07-28.",
    },
    {
        id: "prov_4",
        name: "Ali Al-Farsi",
        email: "ali.farsi.dev@proton.me",
        services: "Python, AI/ML, Data Scraping",
        status: "Pending Review",
        notes: "Specializes in backend services for AI. Seems promising.",
    }
];
