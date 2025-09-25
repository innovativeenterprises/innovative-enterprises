
'use client';

import TimetableForm from "@/components/timetable-form";
import type { TimetableGeneratorInput } from "@/ai/flows/timetable-generator.schema";
import { generateLogisticsSchedule } from "@/ai/flows/logistics-scheduler";

const logisticsDefaultValues: TimetableGeneratorInput = {
  subjects: [
    { id: 'delivery_sohar', name: 'Delivery to Sohar', teacher: 'Truck A (10-ton)', requiredSlots: 2 },
    { id: 'delivery_nizwa', name: 'Delivery to Nizwa', teacher: 'Truck B (5-ton)', requiredSlots: 3 },
    { id: 'delivery_sur', name: 'Delivery to Sur', teacher: 'Truck C (3-ton)', requiredSlots: 1 },
    { id: 'local_muscat', name: 'Local Muscat Deliveries', teacher: 'Van 1', requiredSlots: 6 },
  ],
  classrooms: [
    { id: 'dest_sohar', name: 'Sohar Port' },
    { id: 'dest_nizwa', name: 'Nizwa Industrial Area' },
    { id: 'dest_sur', name: 'Sur Warehouse' },
    { id: 'dest_muscat', name: 'Muscat Hub' },
  ],
  timeSlots: ["08:00 - 12:00 (Morning)", "13:00 - 17:00 (Afternoon)"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
};

const logisticsLabels = {
    cardTitle: "Define Your Logistics Constraints",
    cardDescription: "Define your delivery tasks, vehicles, and destinations. Our AI will generate an optimized, conflict-free weekly schedule.",
    subjectsTitle: "Delivery Tasks & Vehicles",
    subjectNameLabel: "Task / Route Name",
    subjectNamePlaceholder: "e.g., Delivery to Sohar",
    teacherNameLabel: "Assigned Vehicle",
    teacherNamePlaceholder: "e.g., Truck A (10-ton)",
    slotsLabel: "Weekly Slots Required",
    addSubjectLabel: "Add Task",
    classroomsTitle: "Destinations / Hubs",
    classroomNameLabel: "Destination Name",
    classroomNamePlaceholder: "e.g., Sohar Port",
    addClassroomLabel: "Add Destination",
    generateButtonText: "Generate Delivery Schedule"
};

export default function LogisticsSchedulerForm() {
    return (
        <TimetableForm 
            defaultValues={logisticsDefaultValues} 
            labels={logisticsLabels}
            generationFlow={generateLogisticsSchedule}
        />
    )
}
