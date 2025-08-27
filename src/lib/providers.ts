
export interface Provider {
  id: string;
  name: string;
  email: string;
  services: string;
  status: 'Vetted' | 'Pending Review' | 'On Hold';
  portfolio?: string;
  notes?: string;
  subscriptionTier: 'Monthly' | 'Yearly' | 'Lifetime' | 'None';
  subscriptionExpiry: string; // ISO Date string 'YYYY-MM-DD'
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
        subscriptionTier: 'Yearly',
        subscriptionExpiry: '2025-06-15',
    },
    {
        id: "prov_2",
        name: "Jane Doe Graphics",
        email: "jane.doe@gmail.com",
        services: "Branding, Logo Design, Illustration",
        status: "Vetted",
        portfolio: "https://example.com",
        notes: "Winner of the last re-branding competition. Great creative eye.",
        subscriptionTier: 'Monthly',
        subscriptionExpiry: '2024-08-20',
    },
    {
        id: "prov_3",
        name: "Muscat Tech Experts",
        email: "info@muscat-tech.om",
        services: "IT Support, Cloud Migration",
        status: "Pending Review",
        subscriptionTier: 'None',
        subscriptionExpiry: '',
    },
    {
        id: "prov_4",
        name: "Ali Al-Farsi",
        email: "ali.farsi.dev@proton.me",
        services: "Python, AI/ML, Data Scraping",
        status: "Pending Review",
        subscriptionTier: 'None',
        subscriptionExpiry: '',
    },
    {
        id: "prov_5",
        name: "Global Voiceovers",
        email: "talent@globalvoiceovers.com",
        services: "Voice Acting, Audio Production",
        status: "Vetted",
        portfolio: "https://example.com",
        notes: "Provided voice work for the Voxi agent.",
        subscriptionTier: 'Lifetime',
        subscriptionExpiry: '2099-12-31',
    },
    {
        id: "prov_6",
        name: "Nasser Al-Habsi",
        email: "nasser.habsi@oman.net",
        services: "AR/VR Development (Unity)",
        status: "On Hold",
        subscriptionTier: 'Yearly',
        subscriptionExpiry: '2024-09-01',
    },
    {
        id: "prov_7",
        name: "Blue Ocean Marketing",
        email: "hello@blueocean.agency",
        services: "Digital Marketing, SEO, PPC",
        status: "Vetted",
        portfolio: "https://example.com",
        notes: "Handled the successful launch campaign for KHIDMA.",
        subscriptionTier: 'Monthly',
        subscriptionExpiry: '2024-07-30',
    },
    {
        id: "prov_8",
        name: "Fatima Al-Riyami",
        email: "fatima.r@hotmail.com",
        services: "Cybersecurity Auditing",
        status: "Pending Review",
        subscriptionTier: 'None',
        subscriptionExpiry: '',
    },
];
    
