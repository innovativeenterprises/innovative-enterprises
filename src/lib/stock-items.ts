
export interface StockItem {
  id: string;
  name: string;
  category: 'Food & Beverage' | 'Electronics' | 'Apparel' | 'Cosmetics' | 'General Merchandise';
  description: string;
  quantity: string; // e.g., "1 pallet (500 units)"
  price: number;
  saleType: 'Fixed Price' | 'Auction';
  imageUrl: string;
  aiHint: string;
  expiryDate?: string; // ISO Date for perishable goods
  auctionEndDate?: string; // ISO Date for auctions
  status: 'Active' | 'Sold' | 'Expired';
}

export const initialStockItems: StockItem[] = [
  {
    id: 'stock_1',
    name: 'Bulk Packaged Basmati Rice',
    category: 'Food & Beverage',
    description: 'Surplus inventory of premium long-grain basmati rice. 20kg bags.',
    quantity: '10 pallets (500 bags)',
    price: 4500.00,
    saleType: 'Fixed Price',
    imageUrl: 'https://images.unsplash.com/photo-1586201375765-c124a9539a06?q=80&w=1920&auto=format&fit=crop',
    aiHint: 'packaged rice',
    expiryDate: '2025-12-31',
    status: 'Active',
  },
  {
    id: 'stock_2',
    name: 'Wireless Bluetooth Earbuds (Model X2)',
    category: 'Electronics',
    description: 'Previous generation model of wireless earbuds. Fully functional, new in box. Great for resale.',
    quantity: '2000 units',
    price: 8000.00,
    saleType: 'Auction',
    imageUrl: 'https://images.unsplash.com/photo-1606741965326-cb990ae80020?q=80&w=1920&auto=format&fit=crop',
    aiHint: 'wireless earbuds',
    auctionEndDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    status: 'Active',
  },
  {
    id: 'stock_3',
    name: "Men's Cotton T-Shirts (Assorted Colors)",
    category: 'Apparel',
    description: 'Overstock of basic cotton t-shirts from last season. Sizes S, M, L, XL available.',
    quantity: '5000 pieces',
    price: 7500.00,
    saleType: 'Fixed Price',
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1920&auto=format&fit=crop',
    aiHint: 'cotton t-shirts',
    status: 'Active',
  },
  {
    id: 'stock_4',
    name: 'Organic Face Cream',
    category: 'Cosmetics',
    description: 'Face cream with a shelf life ending in 6 months. High-quality organic ingredients.',
    quantity: '1500 units',
    price: 3000.00,
    saleType: 'Auction',
    imageUrl: 'https://images.unsplash.com/photo-1590252518493-0d50a294ebce?q=80&w=1920&auto=format&fit=crop',
    aiHint: 'face cream product',
    expiryDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 6 months from now
    auctionEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    status: 'Active',
  },
   {
    id: 'stock_5',
    name: 'Smartphone Cases for iPhone 13',
    category: 'Electronics',
    description: 'Excess stock of high-quality silicone cases for the iPhone 13 model. Various colors.',
    quantity: '10,000 units',
    price: 5000.00,
    saleType: 'Fixed Price',
    imageUrl: 'https://images.unsplash.com/photo-1593510987185-5231260b9c0d?q=80&w=1920&auto=format&fit=crop',
    aiHint: 'phone cases',
    status: 'Active',
  },
   {
    id: 'stock_6',
    name: 'Canned Tuna in Olive Oil',
    category: 'Food & Beverage',
    description: 'Bulk supply of canned tuna with one year remaining on shelf life. Export quality.',
    quantity: '20 pallets (20,000 cans)',
    price: 12000.00,
    saleType: 'Fixed Price',
    imageUrl: 'https://images.unsplash.com/photo-1577906161421-4a682112458a?q=80&w=1920&auto=format&fit=crop',
    aiHint: 'canned tuna',
    expiryDate: '2025-08-01',
    status: 'Sold',
  },
];
