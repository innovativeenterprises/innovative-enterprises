
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
    },
    {
        id: "prov_5",
        name: "Global Voiceovers",
        email: "talent@globalvoiceovers.com",
        services: "Voice Acting, Audio Production",
        status: "Vetted",
        portfolio: "https://example.com",
        notes: "Provided voice work for the Voxi agent.",
    },
    {
        id: "prov_6",
        name: "Nasser Al-Habsi",
        email: "nasser.habsi@oman.net",
        services: "AR/VR Development (Unity)",
        status: "On Hold",
        portfolio: "https://example.com",
        notes: "Currently on another long-term project. Re-evaluate in Q4.",
    },
    {
        id: "prov_7",
        name: "Blue Ocean Marketing",
        email: "hello@blueocean.agency",
        services: "Digital Marketing, SEO, PPC",
        status: "Vetted",
        portfolio: "https://example.com",
        notes: "Handled the successful launch campaign for KHIDMAAI.",
    },
    {
        id: "prov_8",
        name: "Fatima Al-Riyami",
        email: "fatima.r@hotmail.com",
        services: "Cybersecurity Auditing",
        status: "Pending Review",
        notes: "Certified ethical hacker. Application looks strong.",
    },
    {
        id: "prov_9",
        name: "Salim's Construction",
        email: "salim.con@gmail.com",
        services: "Subcontracting for physical installations",
        status: "On Hold",
        notes: "Unavailable for new contracts until October.",
    },
    {
        id: "prov_10",
        name: "The Content Crew",
        email: "editors@thecontentcrew.co",
        services: "Copywriting, Content Strategy",
        status: "Vetted",
        portfolio: "https://example.com",
        notes: "Excellent for technical writing and blog posts.",
    },
    {
        id: "prov_11",
        name: "Innovate Labs",
        email: "rd@innovatelabs.dev",
        services: "R&D, Prototyping",
        status: "Pending Review",
        notes: "Potential partner for joint R&D projects.",
    },
    {
        id: "prov_12",
        name: "Oman Legal Consultants",
        email: "advice@omanlegal.co",
        services: "Legal Consultation (Corporate)",
        status: "Vetted",
        notes: "Our primary legal partner for contract reviews.",
    }
];
