
import { GanttChartSquare } from "lucide-react";
import TimetableForm from "../timetable-form";

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
            <TimetableForm />
        </div>
      </div>
    </div>
  );
}
