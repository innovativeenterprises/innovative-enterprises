
import type { StockItem } from './stock-items.schema';

export const initialStockItems: StockItem[] = [
  {
    id: 'stock_01',
    name: 'Bulk Pack of Canned Tuna',
    description: '1000 cans of premium canned tuna in olive oil. Nearing expiry date, perfect for quick sale.',
    category: 'Food & Beverage',
    quantity: 1000,
    price: 350.00,
    status: 'Active',
    saleType: 'Fixed Price',
    expiryDate: new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1578506435159-8f9671cf6991?q=80&w=600&auto=format&fit=crop',
    aiHint: 'canned food',
  },
  {
    id: 'stock_02',
    name: 'Lot of iPhone 11 Cases',
    description: '500 assorted iPhone 11 cases. Overstock from last season. Various colors and designs.',
    category: 'Electronics',
    quantity: 500,
    price: 150.00,
    status: 'Active',
    saleType: 'Auction',
    auctionEndDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1594488518061-44fa493a9369?q=80&w=600&auto=format&fit=crop',
    aiHint: 'phone cases',
  },
];
