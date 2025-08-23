import AgentList from "@/components/agent-list";

export default function TeamPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Meet Our Digital Workforce</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Our team of specialized AI agents is ready to automate your business operations, from administrative tasks to complex data analysis.
          </p>
        </div>
        <div className="max-w-7xl mx-auto mt-12">
            <AgentList />
        </div>
      </div>
    </div>
  );
}
