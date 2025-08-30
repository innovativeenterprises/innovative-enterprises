
import { GanttChartSquare } from "lucide-react";
import TimetableForm from "./timetable-form";

export default function EduFlowPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <GanttChartSquare className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">EduFlow Suite</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            An all-in-one administrative automation platform for schools, featuring smart timetabling, automated admissions workflows, and AI-powered resource allocation.
          </p>
        </div>
        <div className="max-w-6xl mx-auto mt-12">
            <TimetableForm />
        </div>
      </div>
    </div>
  );
}
