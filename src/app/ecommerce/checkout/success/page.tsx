
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
    return (
        <div className="bg-muted/20 min-h-[calc(100vh-8rem)] flex items-center justify-center">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-lg mx-auto">
                    <Card className="text-center">
                        <CardHeader className="items-center">
                            <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full w-fit mb-4">
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </div>
                            <CardTitle className="text-3xl">Order Placed Successfully!</CardTitle>
                            <CardDescription className="text-base pt-2">
                                Thank you for your purchase. A confirmation email has been sent to you with your order details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Your order will be processed and shipped within 2-3 business days. You can track your order status from your account page.
                            </p>
                        </CardContent>
                        <CardContent>
                            <Button asChild size="lg">
                                <Link href="/ecommerce">
                                    <ArrowLeft className="mr-2 h-5 w-5" /> Continue Shopping
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
