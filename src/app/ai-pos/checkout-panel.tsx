'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus, Minus, CreditCard, X, Loader2 } from "lucide-react";
import type { CartItem, PosProduct } from "@/lib/pos-data";

export function CheckoutPanel({
    cart,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
    onCheckout,
    isCheckingOut,
}: {
    cart: CartItem[],
    onUpdateQuantity: (productId: string, quantity: number) => void,
    onRemoveItem: (productId: string) => void,
    onClearCart: () => void,
    onCheckout: () => void,
    isCheckingOut: boolean,
}) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.05; // 5% VAT
    const total = subtotal + tax;

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Current Order</CardTitle>
                <CardDescription>Items in the current transaction.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full">
                    <Table>
                        <TableBody>
                            {cart.length === 0 ? (
                                <TableRow>
                                    <TableCell className="text-center text-muted-foreground py-10 col-span-3">
                                        Click on a product to start an order.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                cart.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span>{item.quantity}</span>
                                                 <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {(item.price * item.quantity).toFixed(2)}
                                        </TableCell>
                                        <TableCell className="px-1">
                                             <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => onRemoveItem(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex-col gap-4 border-t pt-6">
                <div className="w-full space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-mono">OMR {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">VAT (5%)</span>
                        <span className="font-mono">OMR {tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                        <span>Total</span>
                        <span className="text-primary font-mono">OMR {total.toFixed(2)}</span>
                    </div>
                </div>
                <div className="w-full grid grid-cols-2 gap-2">
                     <Button variant="outline" onClick={onClearCart} disabled={cart.length === 0}>
                        <X className="mr-2 h-4 w-4"/> Cancel
                    </Button>
                    <Button onClick={onCheckout} disabled={cart.length === 0 || isCheckingOut}>
                        {isCheckingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CreditCard className="mr-2 h-4 w-4"/>}
                        Pay
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
