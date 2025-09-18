
import type { Asset } from './assets.schema';

export const initialAssets: Asset[] = [
  {
    id: 'asset_excavator_1',
    name: '20-Ton Excavator',
    type: 'Heavy Machinery',
    status: 'Available',
    specs: 'Caterpillar 320, with standard bucket. GPS enabled.',
    monthlyPrice: 2500,
    purchasePrice: 120000,
    image: 'https://images.unsplash.com/photo-1551132297-05c315c23b37?q=80&w=600&auto=format&fit=crop',
    aiHint: 'construction excavator'
  },
  {
    id: 'asset_dell_laptop_1',
    name: 'Dell XPS 15',
    type: 'Laptop',
    status: 'Available',
    specs: 'Intel Core i7, 16GB RAM, 512GB SSD, NVIDIA RTX 3050.',
    monthlyPrice: 90,
    purchasePrice: 950,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
    aiHint: 'laptop computer'
  },
  {
    id: 'asset_server_rack_1',
    name: 'Dell PowerEdge R740',
    type: 'Server',
    status: 'Rented',
    specs: '2 x Intel Xeon Silver, 128GB RAM, 8TB SAS Storage.',
    monthlyPrice: 350,
    purchasePrice: 4500,
    image: 'https://images.unsplash.com/photo-1580573483363-d3c13735147e?q=80&w=600&auto=format&fit=crop',
    aiHint: 'server rack'
  },
    {
    id: 'asset_pickup_truck_1',
    name: 'Toyota Hilux',
    type: 'Vehicles',
    status: 'Available',
    specs: '4x4, Double Cab, Automatic Transmission.',
    monthlyPrice: 450,
    purchasePrice: 15000,
    image: 'https://images.unsplash.com/photo-1627549321933-316f7c3c5458?q=80&w=600&auto=format&fit=crop',
    aiHint: 'pickup truck'
  },
  {
    id: 'asset_jackhammer_1',
    name: 'Bosch Electric Jackhammer',
    type: 'Power Tools',
    status: 'Maintenance',
    specs: '15 Amp, 1-1/8 in. Hex, with cart and 2 chisels.',
    monthlyPrice: 120,
    purchasePrice: 800,
    image: 'https://images.unsplash.com/photo-1599361099606-211475734547?q=80&w=600&auto=format&fit=crop',
    aiHint: 'power tool'
  },
  {
    id: 'asset_hp_workstation_1',
    name: 'HP Z4 Workstation',
    type: 'Workstation',
    status: 'Available',
    specs: 'Intel Xeon W-2235, 64GB RAM, 1TB NVMe SSD, NVIDIA Quadro RTX 4000.',
    monthlyPrice: 220,
    purchasePrice: 2800,
    image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=600&auto=format&fit=crop',
    aiHint: 'desktop computer'
  },
  {
    id: 'asset_cisco_switch_1',
    name: 'Cisco Catalyst 9300',
    type: 'Networking',
    status: 'Available',
    specs: '48-port PoE+, 10G Uplinks.',
    monthlyPrice: 180,
    purchasePrice: 2500,
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=600&auto=format&fit=crop',
    aiHint: 'network switch'
  }
];
