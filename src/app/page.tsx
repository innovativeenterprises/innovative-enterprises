'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>Welcome</CardTitle>
                <CardDescription>This is your blank canvas. The Aida AI assistant is ready in the corner. What would you like to build?</CardDescription>
            </CardHeader>
            <CardContent>
                <p>You can start by asking the AI to add components, create new pages, or implement features.</p>
            </CardContent>
        </Card>
    </div>
  );
}
