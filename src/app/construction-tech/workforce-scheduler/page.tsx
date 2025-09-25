import { GanttChartSquare } from "lucide-react";
import TimetableForm from "@/components/timetable-form";
import type { Metadata } from 'next';
import { TimetableGeneratorInput } from "@/ai/flows/timetable-generator.schema";

export const metadata: Metadata = {
  title: "WorkforceFlow | Innovative Enterprises",
  description: "AI-driven workforce scheduling, digital timecards, and IoT equipment tracking to optimize your construction site operations.",
};

const workforceDefaultValues: TimetableGeneratorInput = {
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

const workforceLabels = {
    cardTitle: "Define Your Project Constraints",
    cardDescription: "Define your tasks, teams, and job sites. Our AI will generate an optimized, conflict-free work schedule.",
    subjectsTitle: "Tasks & Assigned Teams",
    subjectNameLabel: "Task",
    subjectNamePlaceholder: "e.g., Concrete Pouring",
    teacherNameLabel: "Worker/Team",
    teacherNamePlaceholder: "e.g., Concrete Team A",
    slotsLabel: "Weekly Slots Required",
    addSubjectLabel: "Add Task",
    classroomsTitle: "Job Sites",
    classroomNameLabel: "Site Name",
    classroomNamePlaceholder: "e.g., Project Site A",
    addClassroomLabel: "Add Job Site",
    generateButtonText: "Generate Work Schedule"
};

export default function WorkforceFlowPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <GanttChartSquare className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">WorkforceFlow</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            An AI-driven platform for workforce scheduling, digital timecards with face recognition, and IoT equipment tracking to optimize your construction site operations.
          </p>
        </div>
        <div className="max-w-6xl mx-auto mt-12 space-y-12">
            <TimetableForm defaultValues={workforceDefaultValues} labels={workforceLabels} />
        </div>
      </div>
    </div>
  );
}