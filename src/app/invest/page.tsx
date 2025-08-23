import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
        <div className="max-w-3xl mx-auto mt-12">
            <Card>
                <CardHeader>
                    <CardTitle>Investor Relations</CardTitle>
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
  );
}
