
import TranslationForm from "./translation-form";
import { Languages, FileText, Banknote, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const documentTypeGroups = {
    "Legal & Official Documents": {
        icon: ShieldCheck,
        items: {
            "Certificates (Birth, Marriage, Death, etc.)": 4.0,
            "Court Documents, Power of Attorney, Notarized Docs": 6.0,
            "Complex Legal Contracts, Immigration Docs": 8.0,
        }
    },
    "Medical & Healthcare Documents": {
        icon: FileText,
        items: {
            "Prescriptions, Test Results, Basic Reports": 4.0,
            "Patient Records, Discharge Summaries": 6.0,
            "Clinical Trials, Research, Device Instructions": 8.0,
        }
    },
    "Business & Commercial Documents": {
        icon: Banknote,
        items: {
            "Company Licenses, Simple Agreements": 5.0,
            "Financial Statements, Policies, MOUs": 7.0,
            "Import/Export, Detailed Trading Contracts": 8.0,
        }
    },
    "Educational & Academic Documents": {
        icon: ShieldCheck,
        items: {
            "Certificates, Diplomas, Transcripts": 4.0,
            "Recommendation Letters, Course Material": 5.0,
            "Thesis, Dissertations, Research Papers": 7.0,
        }
    },
    "Technical & Industrial Documents": {
        icon: FileText,
        items: {
            "User Manuals, Product Guides": 6.0,
            "Patents, Engineering Specs, Safety Data Sheets": 8.0,
        }
    },
    "Media & Marketing Documents": {
        icon: Banknote,
        items: {
            "Flyers, Brochures, Simple Ads": 4.0,
            "Websites, Presentations, Proposals": 6.0,
            "Branding, Creative Copy with Localization": 7.0,
        }
    },
    "Financial & Trade Documents": {
        icon: ShieldCheck,
        items: {
            "Bank Statements, Loan Forms, Insurance Policies": 5.0,
            "Trading Contracts, Customs Declarations, Tax Reports": 7.0,
        }
    },
};

const PriceList = () => (
    <div className="max-w-4xl mx-auto mt-20">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground">
                Transparent pricing based on document complexity. All prices are per page.
            </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(documentTypeGroups).map(([group, { icon: Icon, items }]) => (
                 <Card key={group}>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                             <Icon className="w-6 h-6 text-accent" />
                            <CardTitle className="text-lg">{group}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                           {Object.entries(items).map(([type, price]) => (
                                <li key={type} className="flex justify-between items-center border-b pb-2">
                                    <span className="text-muted-foreground pr-2">{type}</span>
                                    <span className="font-semibold text-primary whitespace-nowrap">OMR {price.toFixed(2)}</span>
                                </li>
                           ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="mt-8 grid md:grid-cols-2 gap-8 text-center">
             <Card>
                <CardHeader><CardTitle>Additional Services</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <p className="flex justify-between"><span>Certified Stamped Copy</span> <span className="font-semibold">OMR 2.50 / page</span></p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>Discounts & Minimums</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <p className="flex justify-between"><span>10+ Pages</span> <span className="font-semibold text-green-600">10% Discount</span></p>
                    <p className="flex justify-between"><span>Minimum Charge</span> <span className="font-semibold">OMR 3.00</span></p>
                </CardContent>
            </Card>
        </div>
    </div>
)


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
        <PriceList />
      </div>
    </div>
  );
}
