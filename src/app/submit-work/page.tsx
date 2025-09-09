
'use client';

import TenderForm from "@/app/tender-assistant/tender-form";
import { Lightbulb } from "lucide-react";

export default function SubmitWorkPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
           <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Lightbulb className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Innovation Gateway & E-Incubator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a brilliant idea, a solution to a daily problem, or a concept for a new startup? Submit it to our e-incubator. Our AI and human experts will analyze its potential, and the best ideas may be selected for awards or sponsorship.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <TenderForm />
        </div>
      </div>
    </div>
  );
}
