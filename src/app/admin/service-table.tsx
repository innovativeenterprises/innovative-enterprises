
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@/lib/services";
import { initialServices } from "@/lib/services";
import { Badge } from "@/components/ui/badge";

export default function ServiceTable() {
    const [services, setServices] = useState<Service[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        try {
            const storedServices = localStorage.getItem('services_status');
            if (storedServices) {
                const parsedServices: Service[] = JSON.parse(storedServices);
                // Ensure all initial services are present
                const allServices = initialServices.map(initialService => {
                    const found = parsedServices.find(s => s.title === initialService.title);
                    return found || initialService;
                });
                setServices(allServices);
            } else {
                setServices(initialServices);
            }
        } catch (error) {
            console.error("Failed to parse services from localStorage", error);
            setServices(initialServices);
        }
    }, []);

    useEffect(() => {
        if (services.length > 0) {
            try {
                localStorage.setItem('services_status', JSON.stringify(services));
            } catch (error) {
                console.error("Failed to save services to localStorage", error);
            }
        }
    }, [services]);

    const handleToggle = (title: string) => {
        setServices(prev =>
            prev.map(service =>
                service.title === title ? { ...service, enabled: !service.enabled } : service
            )
        );
        toast({ title: "Service status updated." });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Service Management</CardTitle>
                <CardDescription>Enable or disable public-facing services from the homepage.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">Service</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map(service => (
                            <TableRow key={service.title}>
                                <TableCell className="font-medium">{service.title}</TableCell>
                                <TableCell>{service.description}</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <Switch
                                            checked={service.enabled}
                                            onCheckedChange={() => handleToggle(service.title)}
                                            aria-label={`Enable/disable ${service.title}`}
                                        />
                                        <Badge variant={service.enabled ? "default" : "secondary"}>
                                            {service.enabled ? "Enabled" : "Disabled"}
                                        </Badge>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
