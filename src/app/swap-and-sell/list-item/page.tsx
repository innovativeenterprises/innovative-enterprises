import { Recycle } from "lucide-react";
import ListItemForm from "./list-item-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "List an Item | Swap & Sell Hub",
  description: "Easily list your used or old items for sale, donation, or as a gift. Just upload a photo and let our AI handle the details.",
};


export default function ListAnItemPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Recycle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">List Your Item</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Give your pre-loved item a new home. Upload a photo, and our AI will suggest a category, description, and price to get you started.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
            <ListItemForm />
        </div>
      </div>
    </div>
  );
}
