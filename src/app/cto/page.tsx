import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CtoPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Let's Be Your CTO</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Leverage our expertise to lead your technology strategy and execution. Get a fractional CTO to guide your startup or project to success.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <Card>
                <CardHeader>
                    <CardTitle>CTO as a Service Inquiry</CardTitle>
                    <CardDescription>Let's discuss how we can help your business.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <Input placeholder="Company Name" />
                        <Input placeholder="Your Name" />
                        <Input type="email" placeholder="Email Address" />
                        <Textarea placeholder="Tell us about your business and your technology challenges." rows={6} />
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Request a Consultation</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
