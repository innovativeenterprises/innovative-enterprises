import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Bot className="w-10 h-10 text-primary" />
            </div>
            <CardTitle>Welcome to Your New Page</CardTitle>
            <CardDescription>This is a blank canvas. You can ask Aida, your AI assistant, to build out this page for you.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-center text-muted-foreground">Try asking: "Create a welcome section with an image and a call to action button."</p>
        </CardContent>
      </Card>
    </div>
  );
}
