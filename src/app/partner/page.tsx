import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PartnerPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Be Our Partner</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Join us in a strategic partnership to drive mutual growth and success. We are looking for partners who share our vision for innovation and excellence.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <Card>
                <CardHeader>
                    <CardTitle>Partnership Inquiry</CardTitle>
                    <CardDescription>Fill out the form below to start the conversation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <Input placeholder="Company Name" />
                        <Input placeholder="Your Name" />
                        <Input type="email" placeholder="Email Address" />
                        <Textarea placeholder="Tell us about your company and why you'd like to partner with us." rows={6} />
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Submit</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
