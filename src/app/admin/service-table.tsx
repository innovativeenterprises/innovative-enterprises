
'use client';

import { useState, useEffect } from "react";
import { DndContext, closestCenter, type DragEndEvent, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import type { Service } from "@/lib/services.schema";
import { GripVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CSS } from '@dnd-kit/utilities';

const SortableServiceRow = ({ service, handleToggle }: { service: Service, handleToggle: (title: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: service.title });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell>
                 <Button variant="ghost" size="icon" {...attributes} {...listeners} className="cursor-grab">
                    <GripVertical className="h-4 w-4" />
                </Button>
            </TableCell>
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
    );
};

export default function ServiceTable({ initialServices }: { initialServices: Service[] }) {
    const [services, setServices] = useState(initialServices);
    const { toast } = useToast();

    useEffect(() => {
        setServices(initialServices);
    }, [initialServices]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            distance: 8,
          },
        })
    );

    const handleToggle = (title: string) => {
        setServices(prev =>
            prev.map(service =>
                service.title === title ? { ...service, enabled: !service.enabled } : service
            )
        );
        toast({ title: "Service status updated." });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setServices((items) => {
                const oldIndex = items.findIndex(item => item.title === active.id);
                const newIndex = items.findIndex(item => item.title === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            toast({ title: "Service order updated." });
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Service Management</CardTitle>
                <CardDescription>Enable or disable public-facing services from the homepage.</CardDescription>
            </CardHeader>
            <CardContent>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Order</TableHead>
                                <TableHead className="w-[250px]">Service</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <SortableContext items={services.map(s => s.title)} strategy={verticalListSortingStrategy}>
                                {services.map(service => (
                                    <SortableServiceRow
                                        key={service.title}
                                        service={service}
                                        handleToggle={handleToggle}
                                    />
                                ))}
                            </SortableContext>
                        </TableBody>
                    </Table>
                </DndContext>
            </CardContent>
        </Card>
    );
}
