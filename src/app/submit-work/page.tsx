
import WorkOrderForm from "./work-order-form";

export default function SubmitWorkPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Submit an Idea or Challenge</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a project, task, or innovative idea? Propose a solution to a daily life issue? Submit it here. Our AI will analyze your request and route it to the right team or post it for our network of skilled partners.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <WorkOrderForm />
        </div>
      </div>
    </div>
  );
}
