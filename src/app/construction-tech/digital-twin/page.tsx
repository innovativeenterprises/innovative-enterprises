
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Eye, Layers, Cpu, Thermometer, Droplets, Zap } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { name: 'HVAC', energy: 4000, color: 'hsl(var(--chart-1))' },
  { name: 'Lighting', energy: 3000, color: 'hsl(var(--chart-2))' },
  { name: 'Plugging', energy: 2000, color: 'hsl(var(--chart-3))' },
  { name: 'Other', energy: 2780, color: 'hsl(var(--chart-4))' },
];

const chartConfig = {
    energy: {
        label: 'Energy (kWh)',
    },
    hvac: {
        label: 'HVAC',
        color: 'hsl(var(--chart-1))',
    },
    lighting: {
        label: 'Lighting',
        color: 'hsl(var(--chart-2))',
    },
    plugging: {
        label: 'Plugging',
        color: 'hsl(var(--chart-3))',
    },
    other: {
        label: 'Other',
        color: 'hsl(var(--chart-4))',
    }
}

export default function DigitalTwinPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <Button asChild variant="outline" className="mb-4">
                    <Link href="/construction-tech">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Construction Tech
                    </Link>
                </Button>
                <div className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Layers className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Digital Twin Operations</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Create a living, breathing digital replica of your physical assets. Our IoT platform enables ongoing monitoring of building performance and predictive maintenance.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Building Performance Dashboard (Mockup)</CardTitle>
                    <CardDescription>A real-time overview of your building's vital signs, powered by IoT sensors.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-muted/50">
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <Thermometer className="w-8 h-8" style={{ color: 'hsl(var(--chart-2))' }}/>
                            <div>
                                <p className="text-sm text-muted-foreground">Avg. Temp</p>
                                <p className="text-2xl font-bold">23.5°C</p>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="bg-muted/50">
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <Droplets className="w-8 h-8" style={{ color: 'hsl(var(--chart-1))' }}/>
                            <div>
                                <p className="text-sm text-muted-foreground">Water Flow</p>
                                <p className="text-2xl font-bold">150 L/min</p>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="bg-muted/50">
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <Zap className="w-8 h-8" style={{ color: 'hsl(var(--chart-3))' }}/>
                            <div>
                                <p className="text-sm text-muted-foreground">Energy Use</p>
                                <p className="text-2xl font-bold">75 kWh</p>
                            </div>
                        </CardHeader>
                    </Card>
                     <Card className="bg-muted/50">
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <Cpu className="w-8 h-8" style={{ color: 'hsl(var(--chart-4))' }}/>
                            <div>
                                <p className="text-sm text-muted-foreground">System Status</p>
                                <p className="text-2xl font-bold">Optimal</p>
                            </div>
                        </CardHeader>
                    </Card>
                    <div className="lg:col-span-4 h-[300px] w-full">
                         <ChartContainer config={chartConfig} className="w-full h-full">
                            <BarChart data={chartData} accessibilityLayer>
                                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} padding={{ left: 10, right: 10 }} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${'\'\'\'' + value / 1000 + '\''\'\''}` + 'k'} />
                                <ChartTooltipContent />
                                <Bar dataKey="energy" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-accent/10 border-accent mt-16">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-accent">Hardware Integration Required</CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                        Digital Twin Operations is a conceptual service requiring on-site installation of IoT sensors and hardware. Contact our team to discuss a custom implementation for your project.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/partner">Request a Consultation</Link>
                    </Button>
                </CardFooter>
            </Card>

        </div>
      </div>
    </div>
  );
}
