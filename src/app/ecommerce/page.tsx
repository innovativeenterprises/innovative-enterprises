
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Store, LineChart, Megaphone } from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: Store,
        title: "Store Setup & Design",
        description: "We build beautiful, high-performance online stores on leading platforms, tailored to your brand and optimized for conversions.",
    },
    {
        icon: Megaphone,
        title: "Digital Marketing",
        description: "Drive traffic and sales with targeted marketing campaigns, including SEO, social media marketing, and email automation.",
    },
    {
        icon: LineChart,
        title: "Analytics & Insights",
        description: "Leverage data to understand customer behavior, track key metrics, and make informed decisions to grow your business.",
    },
    {
        icon: ShoppingCart,
        title: "Operations & Logistics",
        description: "Streamline your order fulfillment, inventory management, and payment processing with our integrated solutions.",
    }
];

export default function EcommercePage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <ShoppingCart className="w-10 h-10 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">E-commerce Solutions</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            From initial setup to scaling your online business, we provide end-to-end e-commerce services to help you succeed in the digital marketplace.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-16">
            <div className="grid md:grid-cols-2 gap-8">
                {features.map((feature) => (
                    <Card key={feature.title} className="bg-card border-l-4 border-primary/50">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <div className="max-w-3xl mx-auto mt-20 text-center">
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-2xl">Ready to Start Selling Online?</CardTitle>
                    <CardDescription>
                        Let's build your e-commerce empire together. Submit your project details and our team will get in touch with a customized plan.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                    <Button asChild size="lg">
                        <Link href="/submit-work">Submit a Work Order</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
