
export interface Product {
    id: number;
    name: string;
    description: string;
    stage: string;
    category: string;
    price: number;
    image: string;
    aiHint: string;
    rating: number;
    enabled: boolean;
}

export const initialProducts: Product[] = [
    {
        id: 1,
        name: "Wireless Headphones",
        description: "High-fidelity audio with noise cancellation.",
        stage: "Ready",
        category: "Electronics",
        price: 129.99,
        image: "https://picsum.photos/seed/p1/400/400",
        aiHint: "headphones product",
        rating: 4.5,
        enabled: true,
    },
    {
        id: 2,
        name: "Modern Coffee Table",
        description: "Oak wood with a minimalist design for modern living.",
        stage: "Ready",
        category: "Home Goods",
        price: 249.00,
        image: "https://picsum.photos/seed/p2/400/400",
        aiHint: "coffee table",
        rating: 4.8,
        enabled: true,
    },
    {
        id: 3,
        name: "Performance Running Shoes",
        description: "Lightweight and responsive for your daily run.",
        stage: "Ready",
        category: "Sports",
        price: 89.95,
        image: "https://picsum.photos/seed/p3/400/400",
        aiHint: "running shoes",
        rating: 4.7,
        enabled: true,
    },
    {
        id: 4,
        name: "Organic Cotton T-Shirt",
        description: "Soft, breathable, and sustainably made.",
        stage: "Ready",
        category: "Apparel",
        price: 24.50,
        image: "https://picsum.photos/seed/p4/400/400",
        aiHint: "cotton t-shirt",
        rating: 4.9,
        enabled: true,
    },
     {
        id: 5,
        name: "Smartwatch Series 8",
        description: "Track your fitness and stay connected on the go.",
        stage: "Ready",
        category: "Electronics",
        price: 399.00,
        image: "https://picsum.photos/seed/p5/400/400",
        aiHint: "smartwatch product",
        rating: 4.9,
        enabled: true,
    },
    {
        id: 6,
        name: "Leather Backpack",
        description: "Stylish and durable for work or travel.",
        stage: "Ready",
        category: "Apparel",
        price: 150.00,
        image: "https://picsum.photos/seed/p6/400/400",
        aiHint: "leather backpack",
        rating: 4.6,
        enabled: true,
    },
    {
        id: 7,
        name: "Non-stick Cookware Set",
        description: "A complete set for all your cooking needs.",
        stage: "Ready",
        category: "Home Goods",
        price: 199.99,
        image: "https://picsum.photos/seed/p7/400/400",
        aiHint: "cookware set",
        rating: 4.7,
        enabled: true,
    },
    {
        id: 8,
        name: "The Alchemist",
        description: "A bestselling novel by Paulo Coelho.",
        stage: "Ready",
        category: "Books",
        price: 12.99,
        image: "https://picsum.photos/seed/p8/400/400",
        aiHint: "book cover",
        rating: 4.8,
        enabled: true,
    },
];
