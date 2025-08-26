
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@/lib/services";
import { Badge } from "@/components/ui/badge";
import { DndContext, closestCenter, type DragEndEvent, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { GripVertical } from 'lucide-react';
import { store } from "@/lib/global-store";

// This hook now connects to the global store.
export const useServicesData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        services: data.services,
        setServices: (updater: (services: Service[]) => Service[]) => {
            const currentServices = store.get().services;
            const newServices = updater(currentServices);
            store.set(state => ({ ...state, services: newServices }));
        }
    };
};

const SortableServiceRow = ({ service, handleToggle }: { service: Service, handleToggle: (title: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: service.title });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <TableRow ref={setNodeRef} style={style} onClick={() => handleToggle(service.title)} className="cursor-pointer">
            <TableCell>
                 <Button variant="ghost" size="icon" {...attributes} {...listeners} onClick={(e) => e.stopPropagation()} className="cursor-grab">
                    <GripVertical className="h-4 w-4" />
                </Button>
            </TableCell>
            <TableCell className="font-medium">{service.title}</TableCell>
            <TableCell>{service.description}</TableCell>
            <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                    <Switch
                        checked={service.enabled}
                        onCheckedChange={(e) => {
                            e.stopPropagation(); // prevent row click from firing as well
                            handleToggle(service.title)
                        }}
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

export default function ServiceTable({ services, setServices }: { services: Service[], setServices: (updater: (services: Service[]) => Service[]) => void }) {
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
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
                        {isMounted ? (
                            <SortableContext items={services.map(s => s.title)} strategy={verticalListSortingStrategy}>
                                <TableBody>
                                    {services.map(service => (
                                        <SortableServiceRow
                                            key={service.title}
                                            service={service}
                                            handleToggle={handleToggle}
                                        />
                                    ))}
                                </TableBody>
                            </SortableContext>
                        ) : (
                            <TableBody>
                                {services.map(service => (
                                    <TableRow key={service.title}>
                                        <TableCell><GripVertical className="h-4 w-4 text-muted-foreground" /></TableCell>
                                        <TableCell className="font-medium">{service.title}</TableCell>
                                        <TableCell>{service.description}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <Switch checked={service.enabled} disabled />
                                                <Badge variant={service.enabled ? "default" : "secondary"}>
                                                    {service.enabled ? "Enabled" : "Disabled"}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </DndContext>
            </CardContent>
        </Card>
    );
}
