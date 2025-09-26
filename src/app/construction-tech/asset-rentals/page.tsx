'use client';

import { Server } from "lucide-react";
import AssetRentalsClientPage from "./client-page";

export default function AssetRentalsPage() {
    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary flex items-center justify-center gap-3">
                        <Server className="w-10 h-10" />
                        InfraRent: IT &amp; Equipment Rentals
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Browse our catalog of high-quality construction equipment, vehicles, and IT hardware available for rent, or let our AI build a custom package for you.
                    </p>
                </div>
                <AssetRentalsClientPage />
            </div>
        </div>
    );
}
