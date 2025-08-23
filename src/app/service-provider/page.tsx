import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ServiceProviderPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Become a Service Provider</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Offer your services to our clients and be part of our trusted network. We are always looking for skilled professionals and companies to collaborate with.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <Card>
                <CardHeader>
                    <CardTitle>Service Provider Application</CardTitle>
                    <CardDescription>Tell us about your expertise.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <Input placeholder="Your Name / Company Name" />
                        <Input type="email" placeholder="Email Address" />
                        <Input placeholder="Service(s) Offered" />
                        <Textarea placeholder="Briefly describe your services and experience." rows={6} />
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Submit Application</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
