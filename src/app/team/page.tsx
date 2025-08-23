import AgentList from "@/components/agent-list";

export default function TeamPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Our Team</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Meet the leaders driving our vision and the AI-powered digital workforce that brings it to life.
          </p>
        </div>
        <div className="max-w-7xl mx-auto mt-12">
            <AgentList />
        </div>
      </div>
    </div>
  );
}
