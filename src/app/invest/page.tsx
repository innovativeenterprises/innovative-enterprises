
import { Download, TrendingUp, Users, Target, Building2, Lightbulb, PackageCheck } from "lucide-react";
import InvestForm from "./invest-form";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const investmentReasons = [
    {
        icon: Target,
        title: "Strategic Market Position",
        description: "As a leading Omani SME, we have a unique advantage in the local market with strong government and corporate partnerships."
    },
    {
        icon: TrendingUp,
        title: "Focus on Emerging Tech",
        description: "Our portfolio is centered on high-growth sectors like AI, Cloud Computing, and Cybersecurity, positioning us for future success."
    },
    {
        icon: Users,
        title: "Experienced Leadership",
        description: "Our team consists of seasoned professionals with a proven track record of delivering innovative projects and driving growth."
    }
]

const currentProjects = [
    { name: "PanoSpace", description: "Immersive platform for virtual tours.", status: "Live" },
    { name: "ameen", description: "Secure digital identity and authentication solution.", status: "Live" },
    { name: "APPI", description: "Intuitive API management and integration platform.", status: "Live" },
    { name: "KHIDMAAI", description: "AI-powered customer service automation tool.", status: "Live" },
    { name: "VMALL", description: "A comprehensive virtual mall and e-commerce ecosystem.", status: "Live" },
];

const pipelineProjects = [
    { name: "EduVerse", description: "An AI-driven platform for personalized education and skill development.", status: "In Development" },
    { name: "Agri-Tech Solutions", description: "IoT and AI-based solutions for optimizing agriculture in arid regions.", status: "Prototyping" },
    { name: "Logistics Chain AI", description: "AI model to optimize supply chain and logistics for local and regional distributors.", status: "In Development" },
];

const comingProjects = [
    { name: "Fintech Super-App", description: "An integrated financial services application for the Omani market.", status: "Research Phase" },
    { name: "Smart City OS", description: "An operating system for managing urban infrastructure and services.", status: "Concept Phase" },
];

const ProjectCard = ({ name, description, status }: { name: string, description: string, status: string }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'Live': return 'bg-green-500';
            case 'In Development': return 'bg-blue-500';
            case 'Prototyping': return 'bg-yellow-500';
            case 'Research Phase': return 'bg-purple-500';
            case 'Concept Phase': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    }
    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{name}</CardTitle>
                     <Badge variant="default" className={`${getStatusColor()} text-white`}>{status}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}

export default function InvestPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Invest With Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore investment opportunities and be part of our innovation journey. We are seeking strategic investors to help us scale our impact.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-16 space-y-16">
            <div>
                 <h2 className="text-3xl font-bold text-center text-primary mb-10">Why Invest in Innovative Enterprises?</h2>
                 <div className="grid md:grid-cols-3 gap-8">
                     {investmentReasons.map((reason) => (
                        <Card key={reason.title} className="text-center group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                             <CardHeader className="items-center">
                                <div className="bg-primary/10 p-4 rounded-full group-hover:bg-accent transition-colors">
                                    <reason.icon className="w-8 h-8 text-primary group-hover:text-accent-foreground" />
                                </div>
                             </CardHeader>
                             <CardContent className="space-y-2">
                                <CardTitle className="text-xl">{reason.title}</CardTitle>
                                <CardDescription>{reason.description}</CardDescription>
                             </CardContent>
                        </Card>
                     ))}
                 </div>
            </div>
            
            <div>
                <h2 className="text-3xl font-bold text-center text-primary mb-10 flex items-center justify-center gap-3">
                    <PackageCheck className="w-8 h-8" /> Current Projects
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProjects.map(p => <ProjectCard key={p.name} {...p} />)}
                </div>
            </div>
            
            <div>
                <h2 className="text-3xl font-bold text-center text-primary mb-10 flex items-center justify-center gap-3">
                    <Building2 className="w-8 h-8" /> On Pipeline Projects
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pipelineProjects.map(p => <ProjectCard key={p.name} {...p} />)}
                </div>
            </div>

            <div>
                 <h2 className="text-3xl font-bold text-center text-primary mb-10 flex items-center justify-center gap-3">
                    <Lightbulb className="w-8 h-8" /> Coming Projects
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {comingProjects.map(p => <ProjectCard key={p.name} {...p} />)}
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-center text-primary mb-10">Pitch Decks & Downloads</h2>
                <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* These links would point to the actual PDF files */}
                    <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-company.pdf" download>
                            <Download className="mr-2 h-5 w-5" /> Company Pitch Deck
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-panospace.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> PanoSpace Project
                        </a>
                    </Button>
                     <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-ameen.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> Ameen Project
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-appi.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> APPI Project
                        </a>
                    </Button>
                     <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-khidmaai.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> KHIDMAAI Project
                        </a>
                    </Button>
                     <Button asChild variant="outline" size="lg">
                        <a href="/pitch-deck-vmall.pdf" download>
                             <Download className="mr-2 h-5 w-5" /> VMALL Project
                        </a>
                    </Button>
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-center text-primary mb-10">Get in Touch</h2>
                <InvestForm />
            </div>
        </div>
      </div>
    </div>
  );
}
