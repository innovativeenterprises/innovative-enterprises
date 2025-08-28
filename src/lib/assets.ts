
export interface Asset {
  id: string;
  name: string;
  type: 'Server' | 'Laptop' | 'Workstation' | 'Networking' | 'Storage' | 'Peripheral';
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
        image: 'https://picsum.photos/seed/asset1/600/400',
        aiHint: 'server rack'
    },
    {
        id: 'asset_2',
        name: 'MacBook Pro 16"',
        type: 'Laptop',
        status: 'Rented',
        specs: 'M3 Max, 32GB RAM, 1TB SSD',
        monthlyPrice: 90,
        image: 'https://picsum.photos/seed/asset2/600/400',
        aiHint: 'laptop computer'
    },
    {
        id: 'asset_3',
        name: 'HP Z4 Workstation',
        type: 'Workstation',
        status: 'Available',
        specs: 'Intel Core i9, 64GB RAM, NVIDIA RTX 4000',
        monthlyPrice: 120,
        image: 'https://picsum.photos/seed/asset3/600/400',
        aiHint: 'desktop computer'
    },
    {
        id: 'asset_4',
        name: 'Cisco Catalyst 9300',
        type: 'Networking',
        status: 'Available',
        specs: '48-port PoE+ Switch',
        monthlyPrice: 80,
        image: 'https://picsum.photos/seed/asset4/600/400',
        aiHint: 'network switch'
    },
    {
        id: 'asset_5',
        name: 'Synology DS923+',
        type: 'Storage',
        status: 'Maintenance',
        specs: '4-Bay NAS, 16TB Capacity',
        monthlyPrice: 60,
        image: 'https://picsum.photos/seed/asset5/600/400',
        aiHint: 'network storage'
    },
    {
        id: 'asset_6',
        name: 'Lenovo ThinkPad X1 Carbon',
        type: 'Laptop',
        status: 'Available',
        specs: 'Intel Core i7, 16GB RAM, 512GB SSD',
        monthlyPrice: 75,
        image: 'https://picsum.photos/seed/asset6/600/400',
        aiHint: 'business laptop'
    },
    {
        id: 'asset_7',
        name: 'HPE ProLiant DL380 Gen10',
        type: 'Server',
        status: 'Available',
        specs: '2x Intel Xeon Gold, 256GB RAM, 8TB SAS',
        monthlyPrice: 220,
        image: 'https://picsum.photos/seed/asset7/600/400',
        aiHint: 'data center server'
    },
    {
        id: 'asset_8',
        name: 'Dell Precision 7920 Tower',
        type: 'Workstation',
        status: 'Rented',
        specs: 'Intel Xeon Gold, 128GB RAM, NVIDIA RTX 6000',
        monthlyPrice: 250,
        image: 'https://picsum.photos/seed/asset8/600/400',
        aiHint: 'powerful workstation'
    },
    {
        id: 'asset_9',
        name: 'NetApp FAS8300',
        type: 'Storage',
        status: 'Available',
        specs: 'All-Flash Array, 50TB effective capacity',
        monthlyPrice: 400,
        image: 'https://picsum.photos/seed/asset9/600/400',
        aiHint: 'enterprise storage'
    },
    {
        id: 'asset_10',
        name: 'Ubiquiti UniFi Switch Pro 24 PoE',
        type: 'Networking',
        status: 'Available',
        specs: '24-port GbE PoE+ & 2-port 10G SFP+',
        monthlyPrice: 50,
        image: 'https://picsum.photos/seed/asset10/600/400',
        aiHint: 'poe switch'
    },
    {
        id: 'asset_11',
        name: 'Microsoft Surface Laptop 5',
        type: 'Laptop',
        status: 'Available',
        specs: 'Intel Core i7, 16GB RAM, 1TB SSD',
        monthlyPrice: 85,
        image: 'https://picsum.photos/seed/asset11/600/400',
        aiHint: 'sleek laptop'
    },
    {
        id: 'asset_12',
        name: 'IBM Power System E980',
        type: 'Server',
        status: 'Maintenance',
        specs: 'POWER9 Processor, 2TB RAM, 10TB NVMe',
        monthlyPrice: 950,
        image: 'https://picsum.photos/seed/asset12/600/400',
        aiHint: 'enterprise server'
    },
    {
        id: 'asset_13',
        name: 'Apple Mac Pro',
        type: 'Workstation',
        status: 'Available',
        specs: 'M2 Ultra, 128GB RAM, 4TB SSD',
        monthlyPrice: 350,
        image: 'https://picsum.photos/seed/asset13/600/400',
        aiHint: 'video editing workstation'
    },
    {
        id: 'asset_14',
        name: 'QNAP TS-h1290FX',
        type: 'Storage',
        status: 'Rented',
        specs: '12-Bay All-Flash NAS, 25GbE connectivity',
        monthlyPrice: 300,
        image: 'https://picsum.photos/seed/asset14/600/400',
        aiHint: 'fast storage'
    },
    {
        id: 'asset_15',
        name: 'Juniper EX4300',
        type: 'Networking',
        status: 'Available',
        specs: '48-port 1GbE Switch, Virtual Chassis',
        monthlyPrice: 110,
        image: 'https://picsum.photos/seed/asset15/600/400',
        aiHint: 'stackable switch'
    },
    {
        id: 'asset_16',
        name: 'Dell OptiPlex 7000',
        type: 'Workstation',
        status: 'Available',
        specs: 'Intel Core i7, 32GB RAM, 1TB NVMe SSD',
        monthlyPrice: 95,
        image: 'https://picsum.photos/seed/asset16/600/400',
        aiHint: 'office computer'
    },
    {
        id: 'asset_17',
        name: 'Cisco ASR 1001-X Router',
        type: 'Networking',
        status: 'Available',
        specs: '2.5-Gbps base, upgradable to 20 Gbps',
        monthlyPrice: 200,
        image: 'https://picsum.photos/seed/asset17/600/400',
        aiHint: 'enterprise router'
    },
    {
        id: 'asset_18',
        name: 'Razer Blade 15',
        type: 'Laptop',
        status: 'Rented',
        specs: 'Intel Core i9, 32GB RAM, NVIDIA RTX 4070',
        monthlyPrice: 130,
        image: 'https://picsum.photos/seed/asset18/600/400',
        aiHint: 'gaming laptop'
    },
    {
        id: 'asset_19',
        name: 'Supermicro SuperServer 5019D-FTN4',
        type: 'Server',
        status: 'Maintenance',
        specs: 'Intel Atom C3558, 64GB RAM, 2x 10GbE LAN',
        monthlyPrice: 130,
        image: 'https://picsum.photos/seed/asset19/600/400',
        aiHint: 'compact server'
    },
    {
        id: 'asset_20',
        name: 'Dell EMC PowerStore 500T',
        type: 'Storage',
        status: 'Available',
        specs: 'NVMe All-Flash, 1.2 PBe max capacity',
        monthlyPrice: 1200,
        image: 'https://picsum.photos/seed/asset20/600/400',
        aiHint: 'storage array'
    },
    {
        id: 'asset_21',
        name: 'Apple iMac 27"',
        type: 'Workstation',
        status: 'Available',
        specs: 'Intel Core i7, 32GB RAM, 1TB SSD, 5K Display',
        monthlyPrice: 110,
        image: 'https://picsum.photos/seed/asset21/600/400',
        aiHint: 'designer computer'
    },
    {
        id: 'asset_22',
        name: 'Arista 7050SX3-48C8',
        type: 'Networking',
        status: 'Rented',
        specs: '48x25GbE SFP & 8x100GbE QSFP',
        monthlyPrice: 350,
        image: 'https://picsum.photos/seed/asset22/600/400',
        aiHint: 'data center switch'
    },
    {
        id: 'asset_23',
        name: 'HP Spectre x360',
        type: 'Laptop',
        status: 'Available',
        specs: 'Intel Core i7, 16GB RAM, 1TB SSD, 2-in-1',
        monthlyPrice: 80,
        image: 'https://picsum.photos/seed/asset23/600/400',
        aiHint: 'convertible laptop'
    },
    {
        id: 'asset_24',
        name: 'Lenovo ThinkSystem SR650',
        type: 'Server',
        status: 'Available',
        specs: '2x Intel Xeon Platinum, 512GB RAM, 12x 3.5" Bays',
        monthlyPrice: 450,
        image: 'https://picsum.photos/seed/asset24/600/400',
        aiHint: 'powerful server'
    },
    {
        id: 'asset_25',
        name: 'Western Digital My Cloud EX4100',
        type: 'Storage',
        status: 'Available',
        specs: '4-Bay Expert Series, 24TB Capacity',
        monthlyPrice: 90,
        image: 'https://picsum.photos/seed/asset25/600/400',
        aiHint: 'nas storage'
    },
    {
        id: 'asset_26',
        name: 'Microsoft Surface Studio 2+',
        type: 'Workstation',
        status: 'Maintenance',
        specs: 'Intel Core i7, 32GB RAM, 1TB SSD, 28" Touchscreen',
        monthlyPrice: 280,
        image: 'https://picsum.photos/seed/asset26/600/400',
        aiHint: 'artist workstation'
    },
    {
        id: 'asset_27',
        name: 'Fortinet FortiGate 100F',
        type: 'Networking',
        status: 'Available',
        specs: 'Next-Gen Firewall, 11.5 Gbps Threat Protection',
        monthlyPrice: 150,
        image: 'https://picsum.photos/seed/asset27/600/400',
        aiHint: 'security firewall'
    },
    {
        id: 'asset_28',
        name: 'Google Pixelbook Go',
        type: 'Laptop',
        status: 'Available',
        specs: 'Intel Core i5, 16GB RAM, 128GB SSD, ChromeOS',
        monthlyPrice: 50,
        image: 'https://picsum.photos/seed/asset28/600/400',
        aiHint: 'chromebook laptop'
    },
    {
        id: 'asset_29',
        name: 'Oracle Exadata X9M',
        type: 'Server',
        status: 'Rented',
        specs: 'Database Machine, High-Performance Storage',
        monthlyPrice: 2500,
        image: 'https://picsum.photos/seed/asset29/600/400',
        aiHint: 'database server'
    },
    {
        id: 'asset_30',
        name: 'Pure Storage FlashArray//X',
        type: 'Storage',
        status: 'Available',
        specs: 'All-NVMe Storage, Purity//FA software',
        monthlyPrice: 1500,
        image: 'https://picsum.photos/seed/asset30/600/400',
        aiHint: 'flash storage array'
    },
    {
        id: 'asset_31',
        name: 'LG 27" UltraFine 4K Monitor',
        type: 'Peripheral',
        status: 'Available',
        specs: '27-inch 4K UHD (3840 x 2160) IPS Display',
        monthlyPrice: 25,
        image: 'https://picsum.photos/seed/asset31/600/400',
        aiHint: '4k monitor'
    },
    {
        id: 'asset_32',
        name: 'Logitech MX Master 3S',
        type: 'Peripheral',
        status: 'Available',
        specs: 'Wireless Performance Mouse with Quiet Clicks',
        monthlyPrice: 10,
        image: 'https://picsum.photos/seed/asset32/600/400',
        aiHint: 'computer mouse'
    },
    {
        id: 'asset_33',
        name: 'Epson SureColor P900',
        type: 'Peripheral',
        status: 'Maintenance',
        specs: '17-Inch Professional Photographic Printer',
        monthlyPrice: 70,
        image: 'https://picsum.photos/seed/asset33/600/400',
        aiHint: 'large printer'
    },
    {
        id: 'asset_34',
        name: 'High-Performance Wifi Router',
        type: 'Networking',
        status: 'Available',
        specs: 'Wi-Fi 6E Tri-Band, supports up to 100 devices',
        monthlyPrice: 30,
        image: 'https://picsum.photos/seed/asset34/600/400',
        aiHint: 'wifi router'
    },
    {
        id: 'asset_35',
        name: 'Conference Room Projector',
        type: 'Peripheral',
        status: 'Available',
        specs: '4000 Lumens, 1080p Full HD Resolution',
        monthlyPrice: 45,
        image: 'https://picsum.photos/seed/asset35/600/400',
        aiHint: 'video projector'
    },
    {
        id: 'asset_36',
        name: 'Mobile Hotspot Device',
        type: 'Networking',
        status: 'Available',
        specs: '5G Connectivity, supports up to 20 devices',
        monthlyPrice: 20,
        image: 'https://picsum.photos/seed/asset36/600/400',
        aiHint: 'mobile hotspot'
    }
];
