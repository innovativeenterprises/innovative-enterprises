
export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    aiHint: string;
    rating: number;
}

export const initialProducts: Product[] = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 129.99,
        image: "https://picsum.photos/seed/p1/400/400",
        aiHint: "headphones product",
        rating: 4.5,
    },
    {
        id: 2,
        name: "Modern Coffee Table",
        category: "Home Goods",
        price: 249.00,
        image: "https://picsum.photos/seed/p2/400/400",
        aiHint: "coffee table",
        rating: 4.8,
    },
    {
        id: 3,
        name: "Performance Running Shoes",
        category: "Sports",
        price: 89.95,
        image: "https://picsum.photos/seed/p3/400/400",
        aiHint: "running shoes",
        rating: 4.7,
    },
    {
        id: 4,
        name: "Organic Cotton T-Shirt",
        category: "Apparel",
        price: 24.50,
        image: "https://picsum.photos/seed/p4/400/400",
        aiHint: "cotton t-shirt",
        rating: 4.9,
    },
     {
        id: 5,
        name: "Smartwatch Series 8",
        category: "Electronics",
        price: 399.00,
        image: "https://picsum.photos/seed/p5/400/400",
        aiHint: "smartwatch product",
        rating: 4.9,
    },
    {
        id: 6,
        name: "Leather Backpack",
        category: "Apparel",
        price: 150.00,
        image: "https://picsum.photos/seed/p6/400/400",
        aiHint: "leather backpack",
        rating: 4.6,
    },
    {
        id: 7,
        name: "Non-stick Cookware Set",
        category: "Home Goods",
        price: 199.99,
        image: "https://picsum.photos/seed/p7/400/400",
        aiHint: "cookware set",
        rating: 4.7,
    },
    {
        id: 8,
        name: "The Alchemist",
        category: "Books",
        price: 12.99,
        image: "https://picsum.photos/seed/p8/400/400",
        aiHint: "book cover",
        rating: 4.8,
    },
];
