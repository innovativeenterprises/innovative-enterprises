'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function MobileNavLinks({ handleLinkClick }: { handleLinkClick: () => void }) {
    const navLinks = [
        { href: "/about", label: "About" },
        { href: "/invest", label: "Invest" },
        { href: "/partner", label: "Partners" },
    ];
    return (
        <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
                <Button
                key={link.href}
                asChild
                variant="ghost"
                className="justify-start text-base"
                onClick={handleLinkClick}
                >
                <Link href={link.href}>{link.label}</Link>
                </Button>
            ))}
        </div>
    );
}
