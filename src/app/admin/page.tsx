import StaffTable from "./staff-table";

export default function AdminPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Manage your digital and human workforce from this central hub.
          </p>
          <StaffTable />
        </div>
      </div>
    </div>
  );
}
