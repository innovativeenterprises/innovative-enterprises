
import ProviderForm from "./provider-form";

export default function ServiceProviderPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Work With Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Offer your services to our clients and be part of our trusted network. We are always looking for skilled freelancers, outsourcers, and subcontractors to collaborate with.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <ProviderForm />
        </div>
      </div>
    </div>
  );
}
