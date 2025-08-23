import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AgentPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Become Our Agent</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Represent Innovative Enterprises and earn commissions by bringing in new business. Join our sales force and help us expand our reach.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <Card>
                <CardHeader>
                    <CardTitle>Agent Application</CardTitle>
                    <CardDescription>Join our team of agents.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <Input placeholder="Your Name" />
                        <Input type="email" placeholder="Email Address" />
                        <Input placeholder="Phone Number" />
                        <Textarea placeholder="Why are you interested in becoming an agent for Innovative Enterprises?" rows={6} />
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Apply Now</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
