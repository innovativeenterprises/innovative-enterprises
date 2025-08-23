import FaqChat from "./faq-chat";

export default function FaqPage() {
    return (
        <div className="bg-background min-h-[calc(100vh-8rem)] py-16">
            <div className="container mx-auto px-4">
                 <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary">Frequently Asked Questions</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Have questions? Our AI-powered assistant is here to help. Ask anything about our services, products, or our unique value as an Omani SME.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto mt-12">
                   <FaqChat />
                </div>
            </div>
        </div>
    );
}
