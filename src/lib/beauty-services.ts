
import type { BeautyService } from './beauty-services.schema';

export const initialBeautyServices: BeautyService[] = [
    { id: 'service_01', agencyId: 'center_01', name: 'Classic Manicure', category: 'Nails', price: 10.0, duration: 45 },
    { id: 'service_02', agencyId: 'center_01', name: 'Hydrating Facial', category: 'Skincare', price: 25.0, duration: 60 },
    { id: 'service_03', agencyId: 'center_01', name: 'Haircut & Blowdry', category: 'Hair', price: 20.0, duration: 75 },
    { id: 'service_04', agencyId: 'center_02', name: 'Classic Haircut', category: 'Hair', price: 8.0, duration: 30 },
    { id: 'service_05', agencyId: 'center_02', name: 'Beard Trim & Style', category: 'Hair', price: 5.0, duration: 20 },
];
