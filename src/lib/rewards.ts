import type { LucideIcon } from "lucide-react";
import { Gem, Award, Shield, Star, Crown } from "lucide-react";

export interface WelcomeKit {
    level: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
    icon: LucideIcon;
    items: string[];
}

export const partnerKits: WelcomeKit[] = [
    {
        level: "Bronze",
        icon: Shield,
        items: [
            "Official Digital Certificate",
            "Bronze Partner Digital Badge",
        ]
    },
    {
        level: "Silver",
        icon: Star,
        items: [
            "All Bronze Tier rewards",
            "Branded Notebook & Pen",
        ]
    },
    {
        level: "Gold",
        icon: Trophy,
        items: [
            "All Silver Tier rewards",
            "Custom Partnership Wall Frame",
            "Branded USB Flash Drive (32GB)",
        ]
    },
    {
        level: "Platinum",
        icon: Crown,
        items: [
            "All Gold Tier rewards",
            "Engraved Stand Table Flag",
            "Custom Partnership Challenge Coin",
        ]
    },
    {
        level: "Diamond",
        icon: Gem,
        items: [
            "All Platinum Tier rewards",
            "Premium Car Sun Shield",
            "Priority support & feature requests",
            "Invitation to Annual Partner Gala",
        ]
    }
];

export const freelancerKits: WelcomeKit[] = [
    {
        level: "Bronze",
        icon: Shield,
        items: [
            "Digital Certificate of Partnership",
            "Bronze Freelancer Digital Badge",
        ]
    },
    {
        level: "Silver",
        icon: Star,
        items: [
            "All Bronze Tier rewards",
            "Premium Branded Notebook & Pen Set",
        ]
    },
    {
        level: "Gold",
        icon: Trophy,
        items: [
            "All Silver Tier rewards",
            "High-Speed USB Flash Drive (64GB)",
            "Listing featured in our monthly newsletter",
        ]
    },
    {
        level: "Platinum",
        icon: Crown,
        items: [
            "All Gold Tier rewards",
            "Custom Engraved Desk Nameplate",
            "Access to exclusive webinars and training",
        ]
    },
    {
        level: "Diamond",
        icon: Gem,
        items: [
            "All Platinum Tier rewards",
            "Personalized Partnership Challenge Coin",
            "A featured interview on our company blog",
            "Direct access to a Partner Success Manager",
        ]
    }
];
