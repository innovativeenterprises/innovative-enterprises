
'use client';

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Search, Bot, Handshake, Check, Star } from "lucide-react";
import Link from "next/link";
import BusinessHubIcon from "@/components/icons/business-hub-icon";
import { ChatComponent } from "@/components/chat/chat-component";
import { useSettingsData } from "@/app/admin/settings-table";
import { answerHubQuery } from "@/ai/flows/business-hub-agent";
import { useProvidersData } from "@/app/admin/provider-table";
import type { Provider } from "@/lib/providers";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const categories = [
    "All", "Tech & IT Services", "Creative & Design", "Consulting & Professional Services", "Legal Services", "Financial & Banking"
];

const ProviderCard = ({ provider }: { provider: Provider }) => (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
        <CardHeader>
             <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{provider.name}</CardTitle>
                {provider.status === 'Vetted' && (
                    <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Vetted
                    </Badge>
                )}
             </div>
            <CardDescription className="text-sm truncate">{provider.services}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="text-muted-foreground text-sm line-clamp-3">
                {provider.notes || `A ${provider.status.toLowerCase()} provider specializing in ${provider.services}. Contact for more details.`}
            </p>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full">
                <Link href={`/provider/${provider.id}`}>View Profile <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
        </CardFooter>
    </Card>
);


export default function BusinessHubPage() {
  const { settings } = useSettingsData();
  const { providers } = useProvidersData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const businessCategoriesList = useMemo(() => {
    const allServices = providers.flatMap(p => p.services.split(',').map(s => s.trim()));
    return ["All", ...Array.from(new Set(allServices))];
  }, [providers]);

  const hubQueryFlow = async (input: { [key: string]: any }) => {
    return await answerHubQuery({
        query: input.message,
        businessCategories: businessCategoriesList.filter(c => c !== 'All'),
    });
  };
  
  const filteredProviders = useMemo(() => {
      return providers.filter(provider => {
          const matchesCategory = selectedCategory === 'All' || provider.services.toLowerCase().includes(selectedCategory.toLowerCase());
          const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || provider.services.toLowerCase().includes(searchTerm.toLowerCase());
          return matchesCategory && matchesSearch;
      })
  }, [providers, selectedCategory, searchTerm]);

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
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Find a Service Provider</h2>
                <p className="mt-2 text-muted-foreground">Search our network of vetted freelancers and partner companies.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                 <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name or service (e.g., 'Web Development')"
                        className="w-full pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                 <div className="flex gap-2 overflow-x-auto pb-2">
                    {businessCategoriesList.slice(0, 6).map((cat) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory(cat)}
                            className="shrink-0"
                        >
                            {cat}
                        </Button>
                    ))}
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
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
