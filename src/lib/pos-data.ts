
import type { PosProduct, DailySales } from './pos-data.schema';

export const initialCanteenProducts: PosProduct[] = [
    { id: 'pos_1', name: 'Cappuccino', category: 'Hot Drinks', price: 1.500, stock: 100, imageUrl: 'https://images.unsplash.com/photo-1517255440298-38604117e43b?q=80&w=400&auto=format&fit=crop' },
    { id: 'pos_2', name: 'Iced Latte', category: 'Cold Drinks', price: 1.800, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1517701559448-34f4b16a6948?q=80&w=400&auto=format&fit=crop' },
    { id: 'pos_3', name: 'Turkey & Cheese Sandwich', category: 'Sandwiches', price: 2.500, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0907910?q=80&w=400&auto=format&fit=crop' },
    { id: 'pos_4', name: 'Oman Chips', category: 'Snacks', price: 0.300, stock: 200, imageUrl: 'https://images.unsplash.com/photo-1599405452230-74f00454a83a?q=80&w=400&auto=format&fit=crop' },
    { id: 'pos_5', name: 'Chocolate Croissant', category: 'Pastries', price: 1.200, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1597333339831-2d3d7fbe515c?q=80&w=400&auto=format&fit=crop' },
    { id: 'pos_6', name: 'Apple Juice', category: 'Cold Drinks', price: 0.800, stock: 150, imageUrl: 'https://images.unsplash.com/photo-1603565345435-85f04a43d92c?q=80&w=400&auto=format&fit=crop' },
    { id: 'pos_7', name: 'Vegetable Samosa', category: 'Snacks', price: 0.400, stock: 80, imageUrl: 'https://images.unsplash.com/photo-1625220194771-494055285771?q=80&w=400&auto=format&fit=crop' },
    { id: 'pos_8', name: 'School Pizza Slice', category: 'Sandwiches', price: 1.000, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=400&auto=format&fit=crop' },
];

export const initialDailySales: DailySales = [];
