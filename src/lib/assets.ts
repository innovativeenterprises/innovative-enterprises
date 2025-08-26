
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
    {
        id: 'asset_6',
        name: 'Lenovo ThinkPad X1 Carbon',
        type: 'Laptop',
        status: 'Available',
        specs: 'Intel Core i7, 16GB RAM, 512GB SSD',
        monthlyPrice: 75,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'business laptop'
    },
    {
        id: 'asset_7',
        name: 'HPE ProLiant DL380 Gen10',
        type: 'Server',
        status: 'Available',
        specs: '2x Intel Xeon Gold, 256GB RAM, 8TB SAS',
        monthlyPrice: 220,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'data center server'
    },
    {
        id: 'asset_8',
        name: 'Dell Precision 7920 Tower',
        type: 'Workstation',
        status: 'Rented',
        specs: 'Intel Xeon Gold, 128GB RAM, NVIDIA RTX 6000',
        monthlyPrice: 250,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'powerful workstation'
    },
    {
        id: 'asset_9',
        name: 'NetApp FAS8300',
        type: 'Storage',
        status: 'Available',
        specs: 'All-Flash Array, 50TB effective capacity',
        monthlyPrice: 400,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'enterprise storage'
    },
    {
        id: 'asset_10',
        name: 'Ubiquiti UniFi Switch Pro 24 PoE',
        type: 'Networking',
        status: 'Available',
        specs: '24-port GbE PoE+ & 2-port 10G SFP+',
        monthlyPrice: 50,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'poe switch'
    },
    {
        id: 'asset_11',
        name: 'Microsoft Surface Laptop 5',
        type: 'Laptop',
        status: 'Available',
        specs: 'Intel Core i7, 16GB RAM, 1TB SSD',
        monthlyPrice: 85,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'sleek laptop'
    },
    {
        id: 'asset_12',
        name: 'IBM Power System E980',
        type: 'Server',
        status: 'Maintenance',
        specs: 'POWER9 Processor, 2TB RAM, 10TB NVMe',
        monthlyPrice: 950,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'enterprise server'
    },
    {
        id: 'asset_13',
        name: 'Apple Mac Pro',
        type: 'Workstation',
        status: 'Available',
        specs: 'M2 Ultra, 128GB RAM, 4TB SSD',
        monthlyPrice: 350,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'video editing workstation'
    },
    {
        id: 'asset_14',
        name: 'QNAP TS-h1290FX',
        type: 'Storage',
        status: 'Rented',
        specs: '12-Bay All-Flash NAS, 25GbE connectivity',
        monthlyPrice: 300,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'fast storage'
    },
    {
        id: 'asset_15',
        name: 'Juniper EX4300',
        type: 'Networking',
        status: 'Available',
        specs: '48-port 1GbE Switch, Virtual Chassis',
        monthlyPrice: 110,
        image: 'https://placehold.co/600x400.png',
        aiHint: 'stackable switch'
    }
];
