
import type { Client, Testimonial } from './clients.schema';

export const initialClients: Client[] = [
  { id: '1', name: 'OmanTel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Omantel_Logo.svg/1024px-Omantel_Logo.svg.png', aiHint: 'telecom logo' },
  { id: '2', name: 'Petroleum Development Oman', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/55/Petroleum_Development_Oman_logo.svg/320px-Petroleum_Development_Oman_logo.svg.png', aiHint: 'oil company logo' },
  { id: '3', name: 'Bank Muscat', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Bank_Muscat_Logo.svg/320px-Bank_Muscat_Logo.svg.png', aiHint: 'bank logo' },
  { id: '4', name: 'Omran', logo: 'https://www.omran.om/images/logo-en.png', aiHint: 'tourism logo' },
  { id: '5', name: 'Sohar Port and Freezone', logo: 'https://www.soharportandfreezone.com/sites/default/files/2019-10/logo.png', aiHint: 'port logo' },
];

export const initialTestimonials: Testimonial[] = [
    {
        id: 'test_1',
        quote: "Innovative Enterprises has been a game-changer for our digital strategy. Their AI-powered tools are **incredibly powerful** and their local market knowledge is unmatched.",
        author: "Ali Al-Saidi",
        company: "CEO, Modern Construction Co.",
        avatarId: 'corp1',
    },
    {
        id: 'test_2',
        quote: "The Sanad Hub platform streamlined our government transactions, **saving us countless hours** every month. It's an essential tool for any SME in Oman.",
        author: "Fatima Al-Hinai",
        company: "Founder, Creative Minds LLC",
        avatarId: 'startup1',
    }
];
