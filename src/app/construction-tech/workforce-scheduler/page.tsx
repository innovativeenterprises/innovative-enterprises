
'use client';

import { GanttChartSquare } from "lucide-react";
import TimetableForm from "@/components/timetable-form";
import type { TimetableGeneratorInput } from "@/ai/flows/timetable-generator.schema";
import { generateLogisticsSchedule } from "@/ai/flows/logistics-scheduler";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WorkforceFlow | Innovative Enterprises",
  description: "AI-driven workforce scheduling, digital timecards, and IoT equipment tracking to optimize your construction site operations.",
};

const workforceDefaultValues: TimetableGeneratorInput = {
  subjects: [
    { id: 'task_concrete', name: 'Concrete Pouring - Foundation', teacher: 'Concrete Team A', requiredSlots: 3 },
    { id: 'task_steel', name: 'Steel Framing - Sector B', teacher: 'Steel Crew 1', requiredSlots: 5 },
    { id: 'task_mep', name: 'MEP Rough-in - First Floor', teacher: 'Plumbing & Electrical Subcontractor', requiredSlots: 4 },
    { id: 'task_facade', name: 'Facade Installation', teacher: 'Facade Specialists', requiredSlots: 6 },
  ],
  classrooms: [
    { id: 'site_sector_a', name: 'Project Site - Sector A' },
    { id: 'site_sector_b', name: 'Project Site - Sector B' },
    { id: 'site_precast_yard', name: 'Pre-cast Yard' },
  ],
  timeSlots: ["07:00 - 11:00 (Morning Shift)", "13:00 - 17:00 (Afternoon Shift)"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
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
    generateButtonText: "Generate Work Schedule",
    aiFlow: generateLogisticsSchedule,
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
            An AI-driven platform for workforce scheduling. Optimize your construction site operations by defining tasks, teams, and locations to generate a conflict-free weekly plan.
          </p>
        </div>
        <div className="max-w-6xl mx-auto mt-12 space-y-12">
            <TimetableForm defaultValues={workforceDefaultValues} labels={workforceLabels} />
        </div>
      </div>
    </div>
  );
}
