import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Leaf, Droplets, Wind, Upload, Download, Flame } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import AppiIcon from "@/components/icons/appi-icon";

const energyData = [
  { month: 'Jan', consumption: 450 },
  { month: 'Feb', consumption: 480 },
  { month: 'Mar', consumption: 510 },
  { month: 'Apr', consumption: 550 },
  { month: 'May', consumption: 620 },
  { month: 'Jun', consumption: 710 },
];
const energyChartConfig = { consumption: { label: "KWh", color: "hsl(var(--chart-3))" } };

const waterData = [
  { month: 'Jan', consumption: 15 },
  { month: 'Feb', consumption: 16 },
  { month: 'Mar', consumption: 15 },
  { month: 'Apr', consumption: 17 },
  { month: 'May', consumption: 18 },
  { month: 'Jun', consumption: 19 },
];
const waterChartConfig = { consumption: { label: "Cubic Meters", color: "hsl(var(--chart-2))" } };

const gasData = [
  { month: 'Jan', consumption: 25 },
  { month: 'Feb', consumption: 28 },
  { month: 'Mar', consumption: 30 },
  { month: 'Apr', consumption: 26 },
  { month: 'May', consumption: 22 },
  { month: 'Jun', consumption: 20 },
];
const gasChartConfig = { consumption: { label: "Units", color: "hsl(var(--chart-5))" } };


export default function AppiPage() {

    const renderChart = (chartType: 'energy' | 'water' | 'gas') => {
        if (chartType === 'energy') {
             return (
                <ChartContainer config={energyChartConfig} className="h-48 w-full">
                    <LineChart data={energyData} margin={{ left: -20, right: 20 }}>
                        <YAxis />
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
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="consumption" fill="var(--color-consumption)" radius={4} />
                    </BarChart>
                </ChartContainer>
            );
        }
        
        if (chartType === 'gas') {
            return (
                 <ChartContainer config={gasChartConfig} className="h-48 w-full">
                     <BarChart data={gasData} accessibilityLayer>
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="consumption" fill="var(--color-consumption)" radius={4} />
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
                        <AppiIcon className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">APPI – عـبِّـي</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                       An innovative mobile application that provides real-time, personalized insights into your household utility consumption (electricity, water, gas), empowering you with predictive analytics and convenient service booking.
                    </p>
                </div>
                <div className="max-w-5xl mx-auto mt-12 space-y-8">
                     <div className="grid md:grid-cols-3 gap-6">
                         <Card>
                             <CardHeader><CardTitle>Total Monthly Cost</CardTitle></CardHeader>
                             <CardContent className="text-3xl font-bold text-primary">OMR 65.70</CardContent>
                        </Card>
                         <Card>
                             <CardHeader><CardTitle>Usage vs. Last Month</CardTitle></CardHeader>
                             <CardContent className="text-3xl font-bold text-destructive">+8.5%</CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Next Bill Prediction</CardTitle></CardHeader>
                            <CardContent className="text-3xl font-bold text-primary">~OMR 71.50</CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Household Consumption Dashboard</CardTitle>
                            <CardDescription>An overview of your utility usage over the past 6 months.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2"><Droplets className="h-5 w-5 text-blue-500" /> Water Consumption</CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <ChartContainer config={waterChartConfig} className="h-48 w-full">
                                        <BarChart data={waterData} accessibilityLayer>
                                            <YAxis />
                                            <Tooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="consumption" fill="var(--color-consumption)" radius={4} />
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2"><Leaf className="h-5 w-5 text-green-500" /> Electricity Usage</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={energyChartConfig} className="h-48 w-full">
                                        <LineChart data={energyData} margin={{ left: -20, right: 20 }}>
                                            <YAxis />
                                            <Tooltip content={<ChartTooltipContent />} />
                                            <Line type="monotone" dataKey="consumption" stroke="var(--color-consumption)" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2"><Flame className="h-5 w-5 text-orange-500" /> Gas Usage</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {renderChart('gas')}
                                </CardContent>
                            </Card>
                        </CardContent>
                         <CardFooter className="flex-col md:flex-row gap-4">
                            <Button className="w-full md:w-auto" disabled><Upload className="mr-2 h-4 w-4"/> Upload Utility Bills</Button>
                            <Button className="w-full md:w-auto" disabled><Download className="mr-2 h-4 w-4"/> Download Full Report</Button>
                            <p className="text-xs text-muted-foreground text-center md:text-left">
                               This platform is in development. Full reporting and automated data ingestion features coming soon.
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
