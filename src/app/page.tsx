import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, DollarSign, Bot, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';

const features = [
    {
        icon: Bot,
        title: "AI-Powered Auditing",
        description: "Let Finley, our AI auditor, perform preliminary checks on your financial documents for compliance and potential red flags."
    },
    {
        icon: ShieldCheck,
        title: "Secure Data Analysis",
        description: "Your financial data is processed with the utmost security, ensuring confidentiality and integrity throughout the analysis."
    },
    {
        icon: ArrowRight,
        title: "Actionable Insights",
        description: "Receive clear, actionable insights and reports to make smarter, data-driven business decisions."
    }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                   <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                    Fintech Revolution
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Welcome to the Fintech Super-App
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    An integrated financial services application providing AI-driven auditing, financial analysis, and CFO dashboard capabilities, powered by our AI agent, Finley.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                     <Link href="/admin/cfo-dashboard">
                      Explore the Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                   <Button asChild size="lg" variant="outline">
                     <Link href="/cfo/audit">
                      Launch AI Audit Tool
                    </Link>
                  </Button>
                </div>
              </div>
               <Image
                src="https://images.unsplash.com/photo-1554224155-8d04421cd6c3?q=80&w=800&auto=format&fit=crop"
                alt="Fintech dashboard"
                width="550"
                height="550"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                data-ai-hint="financial analysis"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Automate Your Financial Oversight</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Our platform provides the tools you need to gain deep insights into your financial operations without the complexity.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
                   {features.map((feature) => (
                    <div key={feature.title} className="grid gap-1 text-center">
                         <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                            <feature.icon className="w-8 h-8 text-primary" />
                        </div>
                      <h3 className="text-lg font-bold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
            </div>
        </section>
      </main>
    </div>
  )
}
