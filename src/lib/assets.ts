
export interface Asset {
  id: string;
  name: string;
  type: 'Server' | 'Laptop' | 'Workstation' | 'Networking' | 'Storage' | 'Peripheral';
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
        name: 'Dell PowerEdge R740',
        type: 'Server',
        status: 'Available',
        specs: '2x Intel Xeon Silver, 128GB RAM, 4TB SSD',
        monthlyPrice: 1.5,
        purchasePrice: 250,
        image: 'https://picsum.photos/seed/asset1/600/400',
        aiHint: 'server rack'
    },
    {
        id: 'asset_2',
        name: 'MacBook Pro 16"',
        type: 'Laptop',
        status: 'Rented',
        specs: 'M3 Max, 32GB RAM, 1TB SSD',
        monthlyPrice: 0.9,
        purchasePrice: 280,
        image: 'https://picsum.photos/seed/asset2/600/400',
        aiHint: 'laptop computer'
    },
    {
        id: 'asset_3',
        name: 'HP Z4 Workstation',
        type: 'Workstation',
        status: 'Available',
        specs: 'Intel Core i9, 64GB RAM, NVIDIA RTX 4000',
        monthlyPrice: 1.2,
        purchasePrice: 220,
        image: 'https://picsum.photos/seed/asset3/600/400',
        aiHint: 'desktop computer'
    },
    {
        id: 'asset_4',
        name: 'Cisco Catalyst 9300',
        type: 'Networking',
        status: 'Available',
        specs: '48-port PoE+ Switch',
        monthlyPrice: 0.8,
        purchasePrice: 150,
        image: 'https://picsum.photos/seed/asset4/600/400',
        aiHint: 'network switch'
    },
    {
        id: 'asset_5',
        name: 'Synology DS923+',
        type: 'Storage',
        status: 'Maintenance',
        specs: '4-Bay NAS, 16TB Capacity',
        monthlyPrice: 0.6,
        purchasePrice: 85,
        image: 'https://picsum.photos/seed/asset5/600/400',
        aiHint: 'network storage'
    },
    {
        id: 'asset_6',
        name: 'Lenovo ThinkPad X1 Carbon',
        type: 'Laptop',
        status: 'Available',
        specs: 'Intel Core i7, 16GB RAM, 512GB SSD',
        monthlyPrice: 0.75,
        purchasePrice: 140,
        image: 'https://picsum.photos/seed/asset6/600/400',
        aiHint: 'business laptop'
    },
    {
        id: 'asset_7',
        name: 'HPE ProLiant DL380 Gen10',
        type: 'Server',
        status: 'Available',
        specs: '2x Intel Xeon Gold, 256GB RAM, 8TB SAS',
        monthlyPrice: 2.2,
        purchasePrice: 450,
        image: 'https://picsum.photos/seed/asset7/600/400',
        aiHint: 'data center server'
    },
    {
        id: 'asset_8',
        name: 'Dell Precision 7920 Tower',
        type: 'Workstation',
        status: 'Rented',
        specs: 'Intel Xeon Gold, 128GB RAM, NVIDIA RTX 6000',
        monthlyPrice: 2.5,
        purchasePrice: 550,
        image: 'https://picsum.photos/seed/asset8/600/400',
        aiHint: 'powerful workstation'
    },
    {
        id: 'asset_9',
        name: 'NetApp FAS8300',
        type: 'Storage',
        status: 'Available',
        specs: 'All-Flash Array, 50TB effective capacity',
        monthlyPrice: 4,
        purchasePrice: 1200,
        image: 'https://picsum.photos/seed/asset9/600/400',
        aiHint: 'enterprise storage'
    },
    {
        id: 'asset_10',
        name: 'Ubiquiti UniFi Switch Pro 24 PoE',
        type: 'Networking',
        status: 'Available',
        specs: '24-port GbE PoE+ & 2-port 10G SFP+',
        monthlyPrice: 0.5,
        purchasePrice: 90,
        image: 'https://picsum.photos/seed/asset10/600/400',
        aiHint: 'poe switch'
    },
    {
        id: 'asset_31',
        name: 'LG 27" UltraFine 4K Monitor',
        type: 'Peripheral',
        status: 'Available',
        specs: '27-inch 4K UHD (3840 x 2160) IPS Display',
        monthlyPrice: 0.25,
        purchasePrice: 45,
        image: 'https://picsum.photos/seed/asset31/600/400',
        aiHint: '4k monitor'
    },
    {
        id: 'asset_32',
        name: 'Logitech MX Master 3S',
        type: 'Peripheral',
        status: 'Available',
        specs: 'Wireless Performance Mouse with Quiet Clicks',
        monthlyPrice: 0.1,
        purchasePrice: 9,
        image: 'https://picsum.photos/seed/asset32/600/400',
        aiHint: 'computer mouse'
    },
    {
        id: 'asset_33',
        name: 'Epson SureColor P900',
        type: 'Peripheral',
        status: 'Maintenance',
        specs: '17-Inch Professional Photographic Printer',
        monthlyPrice: 0.7,
        purchasePrice: 120,
        image: 'https://picsum.photos/seed/asset33/600/400',
        aiHint: 'large printer'
    },
    {
        id: 'asset_34',
        name: 'High-Performance Wifi Router',
        type: 'Networking',
        status: 'Available',
        specs: 'Wi-Fi 6E Tri-Band, supports up to 100 devices',
        monthlyPrice: 0.3,
        purchasePrice: 35,
        image: 'https://picsum.photos/seed/asset34/600/400',
        aiHint: 'wifi router'
    },
    {
        id: 'asset_35',
        name: 'Conference Room Projector',
        type: 'Peripheral',
        status: 'Available',
        specs: '4000 Lumens, 1080p Full HD Resolution',
        monthlyPrice: 0.45,
        purchasePrice: 60,
        image: 'https://picsum.photos/seed/asset35/600/400',
        aiHint: 'video projector'
    },
    {
        id: 'asset_36',
        name: 'Mobile Hotspot Device',
        type: 'Networking',
        status: 'Available',
        specs: '5G Connectivity, supports up to 20 devices',
        monthlyPrice: 0.2,
        purchasePrice: 25,
        image: 'https://picsum.photos/seed/asset36/600/400',
        aiHint: 'mobile hotspot'
    }
];
