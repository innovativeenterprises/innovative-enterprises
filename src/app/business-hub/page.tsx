
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Printer, FlaskConical, BookOpen, GraduationCap, Utensils, Brush, Code, Handshake, Car, Building, HeartPulse, ShoppingBag } from "lucide-react";
import Link from "next/link";
import BusinessHubIcon from "@/components/icons/business-hub-icon";

const categories = [
    { name: "Printing & Publishing", icon: Printer },
    { name: "Perfumes & Cosmetics", icon: FlaskConical },
    { name: "Bookshops & Stationery", icon: BookOpen },
    { name: "Schools & Education", icon: GraduationCap },
    { name: "Restaurants & Cafes", icon: Utensils },
    { name: "Creative & Design", icon: Brush },
    { name: "Tech & IT Services", icon: Code },
    { name: "Consulting & Professional Services", icon: Handshake },
    { name: "Automotive Services", icon: Car },
    { name: "Real Estate & Construction", icon: Building },
    { name: "Health & Wellness", icon: HeartPulse },
    { name: "Retail & E-commerce", icon: ShoppingBag },
];

export default function BusinessHubPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <BusinessHubIcon className="w-12 h-12 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Business Hub</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A B2B and B2C marketplace connecting businesses with each other and with new clients. Find opportunities, collaborate on projects, and grow your network.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Explore Business Categories</h2>
                <p className="mt-4 text-lg text-muted-foreground">Find partners and services in a variety of sectors.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <Card key={cat.name} className="group text-center flex flex-col items-center justify-center p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-primary/5">
                        <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:bg-accent transition-colors">
                            <cat.icon className="w-8 h-8 text-primary group-hover:text-accent-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg">{cat.name}</h3>
                    </Card>
                ))}
            </div>
        </div>

        <div className="max-w-3xl mx-auto mt-20 grid md:grid-cols-2 gap-8">
            <Card className="bg-accent/10 border-accent">
                <CardHeader>
                    <CardTitle className="text-2xl text-accent">For Businesses</CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                       Register your business, showcase your services, and find new partnership opportunities.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-start">
                     <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/partner">Register Your Business <ArrowRight className="ml-2 w-4 h-4"/></Link>
                    </Button>
                </CardFooter>
            </Card>
             <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-2xl">For Clients</CardTitle>
                    <CardDescription>
                       Looking for a specific service? Post a job and get proposals from our network of verified businesses.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-start">
                    <Button asChild variant="secondary">
                        <Link href="/submit-work">Post a Job Opportunity <ArrowRight className="ml-2 w-4 h-4"/></Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>

      </div>
    </div>
  );
}
