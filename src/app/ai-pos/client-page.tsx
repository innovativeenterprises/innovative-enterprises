
'use client';

import { useState, useEffect } from 'react';
import { type PosProduct, type CartItem, type DailySales } from '@/lib/pos-data';
import { PosGrid } from './pos-grid';
import { CheckoutPanel } from './checkout-panel';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit } from 'lucide-react';
import { SalesAnalyticsChat } from './sales-analytics-chat';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function AiPosClientPage({ products, initialDailySales }: { products: PosProduct[], initialDailySales: DailySales }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [dailySales, setDailySales] = useState<DailySales>(initialDailySales);
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleAddToCart = (product: PosProduct) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        setCart(prevCart => {
            if (quantity <= 0) {
                return prevCart.filter(item => item.id !== productId);
            }
            return prevCart.map(item =>
                item.id === productId ? { ...item, quantity } : item
            );
        });
    };
    
    const handleRemoveItem = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    }

    const handleClearCart = () => {
        setCart([]);
    };

    const handleCheckout = () => {
        setIsCheckingOut(true);
        
        setTimeout(() => {
            const newTransaction = {
                id: `trans_${Date.now()}`,
                items: cart,
                total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.05, // with 5% tax
                timestamp: new Date().toISOString(),
            };

            setDailySales(prev => [newTransaction, ...prev]);

            toast({
                title: "Payment Successful",
                description: "The transaction has been recorded.",
            });
            
            setCart([]);
            setIsCheckingOut(false);
        }, 1500);
    };

    if (!isClient) {
        return <div>Loading Point of Sale...</div>; // Or a proper skeleton loader
    }

    return (
        <div className="h-screen w-full bg-muted/30 flex flex-col">
            <header className="bg-background border-b p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-primary">AI-POS for Education</h1>
                 <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <BrainCircuit className="mr-2 h-4 w-4"/> Sales Analytics
                        </Button>
                    </DialogTrigger>
                    <SalesAnalyticsChat dailySales={dailySales}/>
                </Dialog>
            </header>
            <main className="flex-1 overflow-hidden p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                    <div className="lg:col-span-2 h-full overflow-y-auto">
                        <PosGrid products={products} onAddToCart={handleAddToCart} />
                    </div>
                    <div className="lg:col-span-1 h-full">
                         <CheckoutPanel 
                            cart={cart}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                            onClearCart={handleClearCart}
                            onCheckout={handleCheckout}
                            isCheckingOut={isCheckingOut}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
