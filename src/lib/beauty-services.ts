
export interface BeautyService {
    id: string;
    name: string;
    category: 'Hair' | 'Nails' | 'Skincare' | 'Massage' | 'Makeup';
    price: number;
    duration: number; // in minutes
}

export const initialBeautyServices: BeautyService[] = [
    // Hair
    { id: 'serv_01', name: 'Ladies Haircut & Style', category: 'Hair', price: 15.0, duration: 60 },
    { id: 'serv_02', name: 'Full Head Color', category: 'Hair', price: 35.0, duration: 120 },
    { id: 'serv_03', name: 'Keratin Treatment', category: 'Hair', price: 80.0, duration: 180 },
    
    // Nails
    { id: 'serv_04', name: 'Classic Manicure', category: 'Nails', price: 8.0, duration: 45 },
    { id: 'serv_05', name: 'Gel Pedicure', category: 'Nails', price: 12.0, duration: 60 },
    
    // Skincare
    { id: 'serv_06', name: 'Deep Cleansing Facial', category: 'Skincare', price: 25.0, duration: 60 },
    { id: 'serv_07', name: 'Hydrating Facial', category: 'Skincare', price: 30.0, duration: 75 },

    // Massage
    { id: 'serv_08', name: 'Swedish Massage (60 min)', category: 'Massage', price: 20.0, duration: 60 },
    { id: 'serv_09', name: 'Deep Tissue Massage (60 min)', category: 'Massage', price: 25.0, duration: 60 },

    // Makeup
    { id: 'serv_10', name: 'Evening Makeup Application', category: 'Makeup', price: 25.0, duration: 60 },
];
