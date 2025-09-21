
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Leaf, Droplets, Wind, Upload, Download, CheckCircle } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const energyData = [
  { month: 'Jan', consumption: 45000 },
  { month: 'Feb', consumption: 48000 },
  { month: 'Mar', consumption: 51000 },
  { month: 'Apr', consumption: 55000 },
  { month: 'May', consumption: 62000 },
  { month: 'Jun', consumption: 71000 },
];
const energyChartConfig = { consumption: { label: "KWh", color: "hsl(var(--chart-3))" } };

const waterData = [
  { month: 'Jan', consumption: 1500 },
  { month: 'Feb', consumption: 1600 },
  { month: 'Mar', consumption: 1550 },
  { month: 'Apr', consumption: 1700 },
  { month: 'May', consumption: 1800 },
  { month: 'Jun', consumption: 1900 },
];
const waterChartConfig = { consumption: { label: "Cubic Meters", color: "hsl(var(--chart-2))" } };

const carbonData = [
  { month: 'Jan', footprint: 21000 },
  { month: 'Feb', footprint: 22000 },
  { month: 'Mar', footprint: 23500 },
  { month: 'Apr', footprint: 25000 },
  { month: 'May', consumption: 28000 },
  { month: 'Jun', consumption: 32000 },
];
const carbonChartConfig = { footprint: { label: "kgCO2e", color: "hsl(var(--muted-foreground))" } };

export default function EcoBuildCertifyPage() {

    const renderChart = (chartType: 'energy' | 'water' | 'carbon') => {
        if (chartType === 'energy') {
             return (
                <ChartContainer config={energyChartConfig} className="h-48 w-full">
                    <LineChart data={energyData} margin={{ left: -20, right: 20 }}>
                        <YAxis tickFormatter={(value) => `${"'" + value/1000 + "'"}` + 'k'} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="consumption" stroke="var(--color-consumption)" strokeWidth={2} dot={false} />
                    </LineChart>
                </ChartContainer>
            );
        }

        if (chartType === 'water') {
            return (
                <ChartContainer config={waterChartConfig} className="h-48 w-full">
                    <BarChart data={waterData} accessibilityLayer>
                        <YAxis tickFormatter={(value) => `${"'" + value/1000 + "'"}` + 'k'} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="consumption" fill="var(--color-consumption)" radius={4} />
                    </BarChart>
                </ChartContainer>
            );
        }

        if (chartType === 'carbon') {
            return (
                 <ChartContainer config={carbonChartConfig} className="h-48 w-full">
                     <BarChart data={carbonData} accessibilityLayer>
                        <YAxis tickFormatter={(value) => `${"'" + value/1000 + "'"}` + 'k'} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="footprint" fill="var(--color-footprint)" radius={4} />
                    </BarChart>
                </ChartContainer>
            );
        }
    };

    return (
        <div className="bg-background min-h-[calc(100vh-8rem)]">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Leaf className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">EcoBuild Certify</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Automated energy usage tracking, water consumption, and carbon footprint reporting for sustainability compliance and green building certification.
                    </p>
                </div>
                <div className="max-w-5xl mx-auto mt-12 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Sustainability Dashboard</CardTitle>
                            <CardDescription>Overview of your property's environmental performance.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2"><Droplets className="h-5 w-5 text-blue-500" /> Water Consumption</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {renderChart('water')}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2"><Leaf className="h-5 w-5 text-green-500" /> Energy Usage</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {renderChart('energy')}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2"><Wind className="h-5 w-5 text-slate-500" /> Carbon Footprint</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {renderChart('carbon')}
                                </CardContent>
                            </Card>
                        </CardContent>
                         <CardFooter className="flex-col md:flex-row gap-4">
                            <Button className="w-full md:w-auto" disabled><Upload className="mr-2 h-4 w-4"/> Upload Utility Bills</Button>
                            <Button className="w-full md:w-auto" disabled><Download className="mr-2 h-4 w-4"/> Download Full Report</Button>
                            <p className="text-xs text-muted-foreground text-center md:text-left">
                                (Full reporting and automated data ingestion features coming soon)
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
