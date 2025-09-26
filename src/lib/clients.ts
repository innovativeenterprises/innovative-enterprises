
import type { Client, Testimonial } from './clients.schema';

export const initialClients: Client[] = [
  { id: '1', name: 'OmanTel', logo: 'https://placehold.co/150x60/f03a47/ffffff?text=OmanTel&font=raleway', aiHint: 'telecom logo' },
  { id: '2', name: 'Petroleum Development Oman', logo: 'https://placehold.co/150x60/00a6a6/ffffff?text=PDO&font=raleway', aiHint: 'oil company logo' },
  { id: '3', name: 'Bank Muscat', logo: 'https://placehold.co/150x60/f8a5c2/ffffff?text=Bank+Muscat&font=raleway', aiHint: 'bank logo' },
  { id: '4', name: 'Omran', logo: 'https://placehold.co/150x60/28536b/ffffff?text=Omran&font=raleway', aiHint: 'tourism logo' },
  { id: '5', name: 'Sohar Port and Freezone', logo: 'https://placehold.co/150x60/f29e4c/ffffff?text=Sohar+Port&font=raleway', aiHint: 'port logo' },
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
