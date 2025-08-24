import TranslationForm from "./translation-form";
import { Languages } from "lucide-react";

export default function DocumentTranslatorPage() {
  return (
    <div className="bg-background min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Languages className="w-10 h-10 text-primary" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Verified Document Translator</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Translate legal, financial, and official documents with high accuracy. This service is managed by Voxi, our AI Translation Agent, ensuring professional results for your business needs.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <TranslationForm />
        </div>
      </div>
    </div>
  );
}
