
'use client';

import { useState, useEffect } from 'react';
import { type PosProduct, type CartItem, CartItemSchema } from '@/lib/pos-data.schema';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, ShoppingCart, Trash2, Minus, Plus, CreditCard, Loader2 } from 'lucide-react';
import { SalesAnalyticsChat } from './sales-analytics-chat';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGlobalStore, useSetStore } from '@/lib/global-store.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { AppSettings } from '@/lib/settings';

// --- PosGrid Component Logic ---
const PosGrid = ({ products, onAddToCart }: { products: PosProduct[], onAddToCart: (product: PosProduct) => void }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map(product => (
                <Card 
                    key={product.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => onAddToCart(product)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onAddToCart(product)}
                    tabIndex={0}
                >
                    <CardContent className="p-2">
                        <div className="relative aspect-square w-full">
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover rounded-md" />
                        </div>
                        <h3 className="text-sm font-semibold mt-2 truncate">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">OMR {product.price.toFixed(2)}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

// --- CheckoutPanel Component Logic ---
const CheckoutPanel = ({ cart, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout, isCheckingOut, settings }: {
    cart: CartItem[],
    onUpdateQuantity: (productId: string, quantity: number) => void,
    onRemoveItem: (productId: string) => void,
    onClearCart: () => void,
    onCheckout: () => void,
    isCheckingOut: boolean,
    settings: AppSettings | null,
}) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const vat = settings?.vat.enabled ? subtotal * settings.vat.rate : 0;
    const total = subtotal + vat;

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-6 w-6"/> Current Order</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-6">
                    {cart.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="rounded-md object-cover"/>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">OMR {item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                                        <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                                    </div>
                                    <p className="text-sm font-semibold w-16 text-right">OMR {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex-col gap-4 border-t pt-4">
                <div className="w-full space-y-2 text-sm">
                    <div className="flex justify-between"><span>Subtotal</span><span>OMR {subtotal.toFixed(2)}</span></div>
                    {settings?.vat.enabled && <div className="flex justify-between"><span>VAT ({settings.vat.rate * 100}%)</span><span>OMR {vat.toFixed(2)}</span></div>}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg"><span>Total</span><span>OMR {total.toFixed(2)}</span></div>
                </div>
                <div className="w-full grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={onClearCart} disabled={cart.length === 0}><Trash2 className="mr-2 h-4 w-4"/>Clear</Button>
                    <Button onClick={onCheckout} disabled={cart.length === 0 || isCheckingOut}>
                        {isCheckingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CreditCard className="mr-2 h-4 w-4" />}
                        Pay
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};


// --- Main AI POS Page ---
export default function AiPosPage() {
    const posProducts = useGlobalStore(s => s.posProducts);
    const dailySales = useGlobalStore(s => s.dailySales);
    const isClient = useGlobalStore(s => s.isClient);
    const settings = useGlobalStore(s => s.settings);
    const setStore = useSetStore();

    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { toast } = useToast();

    const handleAddToCart = (product: PosProduct) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                // Prevent adding more than available stock
                if (existingItem.quantity >= product.stock) {
                    toast({
                        title: 'Stock Limit Reached',
                        description: `You cannot add more of ${product.name}.`,
                        variant: 'destructive',
                    });
                    return prevCart;
                }
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            if (product.stock < 1) {
                 toast({
                    title: 'Out of Stock',
                    description: `${product.name} is currently out of stock.`,
                    variant: 'destructive',
                });
                return prevCart;
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        const product = posProducts.find(p => p.id === productId);
        if (!product) return;
        
        if (quantity > product.stock) {
             toast({
                title: 'Stock Limit Reached',
                description: `Only ${product.stock} of ${product.name} available.`,
                variant: 'destructive',
            });
            return;
        }

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
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const vat = settings?.vat.enabled ? subtotal * settings.vat.rate : 0;
            const total = subtotal + vat;
            
            const newTransaction = {
                id: `trans_${Date.now()}`,
                items: cart,
                total: total,
                timestamp: new Date().toISOString(),
            };
            
            // Deduct stock
            setStore(state => ({
                ...state,
                posProducts: state.posProducts.map(p => {
                    const cartItem = cart.find(ci => ci.id === p.id);
                    if (cartItem) {
                        return { ...p, stock: p.stock - cartItem.quantity };
                    }
                    return p;
                }),
                dailySales: [newTransaction, ...state.dailySales],
            }));

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
                    <SalesAnalyticsChat dailySales={dailySales} />
                </Dialog>
            </header>
            <main className="flex-1 overflow-hidden p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                    <div className="lg:col-span-2 h-full overflow-y-auto">
                        <PosGrid products={posProducts} onAddToCart={handleAddToCart} />
                    </div>
                    <div className="lg:col-span-1 h-full">
                         <CheckoutPanel 
                            cart={cart}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                            onClearCart={handleClearCart}
                            onCheckout={handleCheckout}
                            isCheckingOut={isCheckingOut}
                            settings={settings}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
