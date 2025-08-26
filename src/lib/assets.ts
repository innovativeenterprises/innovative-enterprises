
export interface Asset {
  id: string;
  name: string;
  type: 'Server' | 'Laptop' | 'Workstation' | 'Networking' | 'Storage';
  status: 'Available' | 'Rented' | 'Maintenance';
  specs: string;
  monthlyPrice: number;
  image: string;
  aiHint: string;
}

export const initialAssets: Asset[] = [
    {
        id: 'asset_1',
        name: 'Dell PowerEdge R740',
        type: 'Server',
        status: 'Available',
        specs: '2x Intel Xeon Silver, 128GB RAM, 4TB SSD',
        monthlyPrice: 150,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'server rack'
    },
    {
        id: 'asset_2',
        name: 'MacBook Pro 16"',
        type: 'Laptop',
        status: 'Rented',
        specs: 'M3 Max, 32GB RAM, 1TB SSD',
        monthlyPrice: 90,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'laptop computer'
    },
    {
        id: 'asset_3',
        name: 'HP Z4 Workstation',
        type: 'Workstation',
        status: 'Available',
        specs: 'Intel Core i9, 64GB RAM, NVIDIA RTX 4000',
        monthlyPrice: 120,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'desktop computer'
    },
    {
        id: 'asset_4',
        name: 'Cisco Catalyst 9300',
        type: 'Networking',
        status: 'Available',
        specs: '48-port PoE+ Switch',
        monthlyPrice: 80,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'network switch'
    },
    {
        id: 'asset_5',
        name: 'Synology DS923+',
        type: 'Storage',
        status: 'Maintenance',
        specs: '4-Bay NAS, 16TB Capacity',
        monthlyPrice: 60,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'network storage'
    },
];
