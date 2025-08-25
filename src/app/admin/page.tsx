
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StaffTable from "./staff-table";
import { Users, Bot, Zap, CheckCircle } from "lucide-react";
import ServiceTable from "./service-table";
import OpportunityTable from "./opportunity-table";
import ProviderTable from "./provider-table";
import ProductTable from "./product-table";
import ClientTable from "./client-table";
import PricingTable from "./pricing-table";
import SettingsTable from "./settings-table";

const overviewStats = [
    { title: "Total Staff (Human + AI)", value: "26", icon: Users },
    { title: "Active AI Agents", value: "21", icon: Bot },
    { title: "AI Interactions Today", value: "1,482", icon: Zap },
    { title: "System Status", value: "All Systems Normal", icon: CheckCircle, color: "text-green-500" },
];

export default function AdminPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto space-y-12">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">Admin Dashboard</h1>
                <p className="text-lg text-muted-foreground">
                    Manage your digital and human workforce from this central hub.
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {overviewStats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color ?? ''}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <SettingsTable />
            <StaffTable />
            <ServiceTable />
            <ProductTable />
            <ClientTable />
            <OpportunityTable />
            <ProviderTable />
            <PricingTable />
        </div>
      </div>
    </div>
  );
}
