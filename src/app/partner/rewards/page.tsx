
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Award, Shield, CheckCircle, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { partnerKits, freelancerKits, type WelcomeKit } from '@/lib/rewards';
import { Badge } from "@/components/ui/badge";
import type { Metadata } from 'next';
import PartnerRewardsClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Partner Rewards Program | Innovative Enterprises",
  description: "Explore the benefits and rewards of joining our partner network. View welcome kits, digital certificates, and level-wise badges for our valued partners.",
};

export default function PartnerRewardsPage() {
    // In a real app, this would come from the user's session/profile
    const currentPartnerTier = "Gold"; 

    return (
       <PartnerRewardsClientPage partnerKits={partnerKits} freelancerKits={freelancerKits} currentPartnerTier={currentPartnerTier} />
    )
}
