
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Download, TrendingUp, Users, Target } from "lucide-react";

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
                <h2 className="text-3xl font-bold text-center text-primary mb-10">Pitch Decks & Downloads</h2>
                <div className="max-w-2xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Investor Relations Inquiry</CardTitle>
                        <CardDescription>Please fill out the form to get in touch with our investment team.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <Input placeholder="Full Name / Organization Name" />
                            <Input type="email" placeholder="Email Address" />
                            <Input placeholder="Investment Range (Optional)" />
                            <Textarea placeholder="Please provide a brief introduction and your area of interest." rows={6} />
                            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Submit Inquiry</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
