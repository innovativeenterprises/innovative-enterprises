import { GanttChartSquare } from "lucide-react";
import TimetableForm from "@/components/timetable-form";
import type { TimetableGeneratorInput } from "@/ai/flows/timetable-generator.schema";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Smart Timetable Generator",
    description: "Define your subjects, teachers, and classrooms. Our AI will generate an optimized, conflict-free schedule, saving you hours of manual work."
};

const schoolDefaultValues: TimetableGeneratorInput = {
  subjects: [
    { id: 'math1', name: 'Mathematics', teacher: 'Mr. Ahmed', requiredSlots: 5 },
    { id: 'sci1', name: 'Science', teacher: 'Ms. Fatima', requiredSlots: 4 },
    { id: 'eng1', name: 'English', teacher: 'Mr. David', requiredSlots: 5 },
    { id: 'art1', name: 'Art', teacher: 'Ms. Chloe', requiredSlots: 2 },
  ],
  classrooms: [
    { id: 'c101', name: 'Classroom 101' },
    { id: 'c102', name: 'Classroom 102' },
    { id: 'art_room', name: 'Art Room' },
  ],
  timeSlots: ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
};

const schoolLabels = {
    cardTitle: "Define Your School's Constraints",
    cardDescription: "Define your subjects, teachers, and classrooms. Our AI will generate an optimized, conflict-free schedule.",
    subjectsTitle: "Subjects & Teachers",
    subjectNameLabel: "Subject",
    subjectNamePlaceholder: "e.g., Mathematics",
    teacherNameLabel: "Teacher",
    teacherNamePlaceholder: "e.g., Mr. Ahmed",
    slotsLabel: "Weekly Slots",
    addSubjectLabel: "Add Subject",
    classroomsTitle: "Classrooms",
    classroomNameLabel: "Classroom Name",
    classroomNamePlaceholder: "e.g., Classroom 101",
    addClassroomLabel: "Add Classroom",
    generateButtonText: "Generate Timetable",
};


export default function TimetableGeneratorPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <GanttChartSquare className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">AI Smart Timetable Generator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Define your subjects, teachers, and classrooms. Our AI will generate an optimized, conflict-free schedule, saving you hours of manual work.
          </p>
        </div>
        <div className="max-w-6xl mx-auto mt-12 space-y-12">
            <TimetableForm defaultValues={schoolDefaultValues} labels={schoolLabels} />
        </div>
      </div>
    </div>
  );
}
