
'use client';

import React from 'react';
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from '@/lib/utils';

interface PartnerCardProps {
    cardRef: React.RefObject<HTMLDivElement>;
    partnerName: string;
    crNumber?: string;
    joiningDate: string;
    expiryDate: string;
    classification: string;
    services: string;
    partnerType: string;
    logoUrl?: string;
    freelancerId?: string;
}

export const PartnerCard = ({
    cardRef,
    partnerName,
    crNumber,
    joiningDate,
    expiryDate,
    classification,
    services,
    partnerType,
    logoUrl,
    freelancerId,
}: PartnerCardProps) => {

    const getTierColor = () => {
        switch(classification.toLowerCase()) {
            case 'diamond': return 'from-blue-400 to-indigo-500';
            case 'gold': return 'from-yellow-400 to-amber-500';
            case 'silver': return 'from-gray-400 to-slate-500';
            case 'bronze': return 'from-orange-400 to-amber-600';
            default: return 'from-gray-200 to-gray-300';
        }
    }

    const getTierTextColor = () => {
         switch(classification.toLowerCase()) {
            case 'diamond':
            case 'gold':
            case 'silver':
            case 'bronze': return 'text-white';
            default: return 'text-gray-800';
        }
    }
    
    const referralUrl = `https://innovativeenterprises.tech/register?ref=${freelancerId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(referralUrl)}&bgcolor=1f2937`;


    return (
        <div ref={cardRef} className={`w-full max-w-lg mx-auto rounded-xl bg-gradient-to-br ${getTierColor()} p-1 shadow-2xl`}>
            <div className="bg-gray-800 rounded-lg p-6 relative h-full text-white">
                 <div className="absolute top-4 right-4">
                    <Image src="https://storage.googleapis.com/stella-images/studio-app-live/20240801-140026-646-logo.png" alt="IE Logo" width={40} height={40} className="opacity-80" />
                </div>
                 <div className="absolute bottom-2 right-2 w-20 h-20 p-1 bg-white rounded-md">
                     {freelancerId && <img src={qrCodeUrl} alt="Referral QR Code" className="w-full h-full" />}
                </div>
                
                <div className="flex items-start gap-4">
                    {logoUrl && (
                        <div className="w-20 h-20 bg-white rounded-md flex-shrink-0 flex items-center justify-center p-1">
                            <Image src={logoUrl} alt="Partner Logo" width={72} height={72} className="object-contain" />
                        </div>
                    )}
                    <div className="flex-grow">
                        <p className="text-xs font-semibold uppercase tracking-widest opacity-70">{partnerType}</p>
                        <h3 className="text-2xl font-bold">{partnerName}</h3>
                        {crNumber && <p className="font-mono text-sm opacity-80">CRN: {crNumber}</p>}
                        {freelancerId && <p className="font-mono text-sm opacity-80">ID: {freelancerId}</p>}
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <div className="text-sm">
                        <p className="font-semibold opacity-70">Services:</p>
                        <p className="opacity-90 truncate">{services}</p>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                        <div>
                            <p className="opacity-70">Joined:</p>
                            <p className="font-semibold opacity-90">{joiningDate}</p>
                        </div>
                        <div className="text-right">
                            <p className="opacity-70">Expires:</p>
                            <p className="font-semibold opacity-90">{expiryDate}</p>
                        </div>
                    </div>
                </div>

                 <div className="absolute bottom-4 left-4">
                    <p className={`font-bold text-lg tracking-wider uppercase ${getTierTextColor()} flex items-center gap-2`}>
                        <Star className="w-5 h-5 fill-current" /> {classification} Partner
                    </p>
                </div>
            </div>
        </div>
    )
}
