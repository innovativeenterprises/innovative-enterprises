
export interface Asset {
  id: string;
  name: string;
  type: 'Heavy Machinery' | 'Power Tools' | 'Vehicles' | 'Scaffolding' | 'Server' | 'Laptop' | 'Workstation' | 'Networking' | 'Storage' | 'Peripheral';
  status: 'Available' | 'Rented' | 'Maintenance';
  specs: string;
  monthlyPrice: number;
  purchasePrice?: number;
  image: string;
  aiHint: string;
}

export const initialAssets: Asset[] = [
    {
        id: 'asset_1',
        name: 'Caterpillar 320 Excavator',
        type: 'Heavy Machinery',
        status: 'Available',
        specs: '20-ton class, 1.19 m³ bucket capacity',
        monthlyPrice: 2500.0,
        purchasePrice: 95000,
        image: 'https://picsum.photos/seed/asset1/600/400',
        aiHint: 'construction excavator'
    },
    {
        id: 'asset_2',
        name: 'Komatsu D65 Bulldozer',
        type: 'Heavy Machinery',
        status: 'Rented',
        specs: '155 HP, Operating Weight 20 tons',
        monthlyPrice: 3200.0,
        purchasePrice: 120000,
        image: 'https://picsum.photos/seed/asset2/600/400',
        aiHint: 'construction bulldozer'
    },
    {
        id: 'asset_3',
        name: 'Bosch Hammer Drill',
        type: 'Power Tools',
        status: 'Available',
        specs: '18V, Cordless, with 2 batteries',
        monthlyPrice: 50.0,
        purchasePrice: 180,
        image: 'https://picsum.photos/seed/asset3/600/400',
        aiHint: 'hammer drill'
    },
    {
        id: 'asset_4',
        name: 'Toyota Hilux Pickup',
        type: 'Vehicles',
        status: 'Available',
        specs: '4x4, Double Cab',
        monthlyPrice: 450.0,
        purchasePrice: 12000,
        image: 'https://picsum.photos/seed/asset4/600/400',
        aiHint: 'pickup truck'
    },
    {
        id: 'asset_5',
        name: 'Scaffolding System (100m²)',
        type: 'Scaffolding',
        status: 'Maintenance',
        specs: 'Includes all frames, braces, and boards',
        monthlyPrice: 300.0,
        purchasePrice: 2500,
        image: 'https://picsum.photos/seed/asset5/600/400',
        aiHint: 'construction scaffolding'
    },
    {
        id: 'asset_6',
        name: 'Dell PowerEdge R740',
        type: 'Server',
        status: 'Available',
        specs: '2x Intel Xeon Silver, 128GB RAM, 4TB SSD',
        monthlyPrice: 150.0,
        purchasePrice: 2500,
        image: 'https://picsum.photos/seed/server1/600/400',
        aiHint: 'server rack'
    },
    {
        id: 'asset_7',
        name: 'MacBook Pro 16"',
        type: 'Laptop',
        status: 'Rented',
        specs: 'M3 Max, 32GB RAM, 1TB SSD',
        monthlyPrice: 90.0,
        purchasePrice: 1200,
        image: 'https://picsum.photos/seed/laptop1/600/400',
        aiHint: 'laptop computer'
    }
];
