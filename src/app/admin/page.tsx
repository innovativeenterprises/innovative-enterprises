

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bot, Zap, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const overviewStats = [
    { title: "Total Staff (Human + AI)", value: "26", icon: Users, href: "/admin/people" },
    { title: "Active AI Agents", value: "21", icon: Bot, href: "/admin/people" },
    { title: "Active Opportunities", value: "5", icon: Zap, href: "/admin/operations" },
    { title: "System Status", value: "All Systems Normal", icon: CheckCircle, color: "text-green-500", href: "#" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
              An overview of your digital and human workforce.
          </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {overviewStats.map((stat, index) => (
              <Link href={stat.href} key={index}>
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color ?? ''}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
              </Link>
          ))}
      </div>
    </div>
  );
}
