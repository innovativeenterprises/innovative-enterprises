
'use client';

import { useState, useEffect } from 'react';
import { store } from '@/lib/global-store';
import type { Service } from '@/lib/services';
import type { Product } from '@/lib/products';
import type { Client, Testimonial } from '@/lib/clients';

export const useServicesData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        services: data.services,
        setServices: (updater: (services: Service[]) => Service[]) => {
            const currentServices = store.get().services;
            const newServices = updater(currentServices);
            store.set(state => ({ ...state, services: newServices }));
        }
    };
};

export const useProductsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        products: data.products,
        setProducts: (updater: (products: Product[]) => Product[]) => {
            const currentProducts = store.get().products;
            const newProducts = updater(currentProducts);
            store.set(state => ({ ...state, products: newProducts }));
        }
    };
};


export const useClientsData = () => {
    const [data, setData] = useState(store.get());

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            setData(store.get());
        });
        return () => unsubscribe();
    }, []);

    return {
        clients: data.clients,
        setClients: (updater: (clients: Client[]) => Client[]) => {
            const currentClients = store.get().clients;
            const newClients = updater(currentClients);
            store.set(state => ({ ...state, clients: newClients }));
        },
        testimonials: data.testimonials,
        setTestimonials: (updater: (testimonials: Testimonial[]) => Testimonial[]) => {
             const currentTestimonials = store.get().testimonials;
            const newTestimonials = updater(currentTestimonials);
            store.set(state => ({ ...state, testimonials: newTestimonials }));
        }
    };
};
