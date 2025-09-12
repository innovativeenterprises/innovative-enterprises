
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FacebookCoverPage() {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 text-white">
       <div className="absolute top-4 left-4">
            <Button asChild variant="outline" className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
        </div>
      <Card className="w-full max-w-4xl bg-gray-800/50 border-gray-700 shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="relative w-full aspect-[2.39/1]">
            <Image
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
              alt="AI Technology Background"
              fill
              className="object-cover"
              data-ai-hint="circuit board"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent p-12 flex flex-col justify-center">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-lg">
                AI Technology
              </h1>
              <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-lg drop-shadow-md">
                Pioneering the Future of Intelligent Systems.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
       <p className="text-xs text-gray-500 mt-4">
        This is a responsive preview. The image is designed for a standard Facebook cover photo ratio.
      </p>
    </div>
  );
}
