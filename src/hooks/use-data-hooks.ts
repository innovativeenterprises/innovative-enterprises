
'use client';

import { useState, useEffect, useContext } from 'react';
import { StoreContext } from '@/components/layout/global-store';
import type { AppState } from '@/lib/global-store';

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;
type StoreUpdater<T> = (updater: (prev: T) => T) => void;

function useStoreData<T>(
    initialData: T,
    selector: (state: AppState) => T,
    setter: (set: StoreUpdater<T>) => void
) {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useStoreData must be used within a StoreProvider');
    }
    
    const [data, setDataState] = useState<T>(initialData);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const newState = selector(store.get());
            setDataState(newState);
        });
        
        // Initial sync and mark as client
        const initialStoreState = selector(store.get());
        setDataState(initialStoreState);
        setIsClient(true);
        
        return () => unsubscribe();
    }, [store, selector]);

    const setStoreData: StoreUpdater<T> = (updater) => {
        setter((prev: T) => {
            const newState = updater(prev);
            setDataState(newState); // Also update local state to trigger re-render
            return newState;
        });
    };
    
    return { data, setData: setStoreData, isClient };
}


export const useProductsData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error("useProductsData must be used within a StoreProvider.");
    const [state, setState] = useState({
        products: store.get().products,
        storeProducts: store.get().storeProducts,
        isClient: store.get().isClient
    });

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const currentState = store.get();
            setState({
                products: currentState.products,
                storeProducts: currentState.storeProducts,
                isClient: currentState.isClient,
            });
        });
        return unsubscribe;
    }, [store]);

    const setProducts: StoreUpdater<AppState['products']> = (updater) => {
        store.set(s => ({ ...s, products: updater(s.products) }));
    };
    const setStoreProducts: StoreUpdater<AppState['storeProducts']> = (updater) => {
        store.set(s => ({ ...s, storeProducts: updater(s.storeProducts) }));
    };
    
    return { ...state, setProducts, setStoreProducts };
};


export const useSettingsData = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useSettingsData must be used within a StoreProvider');
  }
  const [settings, setSettingsState] = useState(store.get().settings);
  const [isClient, setIsClient] = useState(store.get().isClient);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const currentSettings = store.get().settings;
      const currentIsClient = store.get().isClient;
      setSettingsState(currentSettings);
      setIsClient(currentIsClient);
    });
    return unsubscribe;
  }, [store]);
  
  const setSettings: StoreUpdater<AppState['settings']> = (updater) => {
    store.set(s => ({ ...s, settings: updater(s.settings) }));
  };

  return { settings, setSettings, isClient };
};

export const useCartData = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useCartData must be used within a StoreProvider.");

  const [cart, setCartState] = useState(store.get().cart);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCartState(store.get().cart);
    });
    return unsubscribe;
  }, [store]);

  const setCart: StoreUpdater<AppState['cart']> = (updater) => {
    store.set(s => ({ ...s, cart: updater(s.cart) }));
  };
  
  return { cart, setCart };
};

export const usePosProductsData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error("usePosProductsData must be used within a StoreProvider.");
    const [state, setState] = useState({
        posProducts: store.get().posProducts,
        isClient: store.get().isClient
    });

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const currentState = store.get();
            setState({
                posProducts: currentState.posProducts,
                isClient: currentState.isClient,
            });
        });
        return unsubscribe;
    }, [store]);

    const setPosProducts: StoreUpdater<AppState['posProducts']> = (updater) => {
        store.set(s => ({ ...s, posProducts: updater(s.posProducts) }));
    };
    
    return { ...state, setPosProducts };
};

export const usePosData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error("usePosData must be used within a StoreProvider.");
    const [state, setState] = useState({
        dailySales: store.get().dailySales,
        isClient: store.get().isClient
    });

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const currentState = store.get();
            setState({
                dailySales: currentState.dailySales,
                isClient: currentState.isClient,
            });
        });
        return unsubscribe;
    }, [store]);

    const setDailySales: StoreUpdater<AppState['dailySales']> = (updater) => {
        store.set(s => ({ ...s, dailySales: updater(s.dailySales) }));
    };
    
    return { ...state, setDailySales };
};


export const useStairspaceData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error("useStairspaceData must be used within a StoreProvider.");
    const [state, setState] = useState({
        stairspaceListings: store.get().stairspaceListings,
        isClient: store.get().isClient
    });

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const currentState = store.get();
            setState({
                stairspaceListings: currentState.stairspaceListings,
                isClient: currentState.isClient,
            });
        });
        return unsubscribe;
    }, [store]);
    
    const setStairspaceListings: StoreUpdater<AppState['stairspaceListings']> = (updater) => {
        store.set(s => ({ ...s, stairspaceListings: updater(s.stairspaceListings) }));
    };
    
    return { ...state, setStairspaceListings };
}

export const useStairspaceRequestsData = (initialData: AppState['stairspaceRequests'] = []) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error("useStairspaceRequestsData must be used within a StoreProvider.");
    const [data, setData] = useState(initialData);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setData(store.get().stairspaceRequests);
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get().stairspaceRequests);
        });
        return unsubscribe;
    }, [store]);
    
    const setStairspaceRequests: StoreUpdater<AppState['stairspaceRequests']> = (updater) => {
        store.set(s => ({ ...s, stairspaceRequests: updater(s.stairspaceRequests) }));
    };
    
    return { data, setData: setStairspaceRequests, isClient };
};

export const useStockItemsData = (initialData: AppState['stockItems'] = []) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error("useStockItemsData must be used within a StoreProvider.");
    const [data, setData] = useState(initialData);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setData(store.get().stockItems);
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get().stockItems);
        });
        return unsubscribe;
    }, [store]);
    
    const setItems: StoreUpdater<AppState['stockItems']> = (updater) => {
        store.set(s => ({ ...s, stockItems: updater(s.stockItems) }));
    };

    return { data, setData: setItems, isClient };
};

export const useUsedItemsData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error("useUsedItemsData must be used within a StoreProvider.");
    const [state, setState] = useState({
        items: store.get().usedItems,
        isClient: store.get().isClient
    });

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const currentState = store.get();
            setState({
                items: currentState.usedItems,
                isClient: currentState.isClient,
            });
        });
        return unsubscribe;
    }, [store]);

    const setItems: StoreUpdater<AppState['usedItems']> = (updater) => {
        store.set(s => ({ ...s, usedItems: updater(s.usedItems) }));
    };
    
    return { ...state, setItems };
}

export const useGiftCardsData = (initialData: AppState['giftCards'] = []) => {
    const store = useContext(StoreContext);
    if (!store) throw new Error("useGiftCardsData must be used within a StoreProvider.");
    const [data, setData] = useState(initialData);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setData(store.get().giftCards);
        setIsClient(true);
        const unsubscribe = store.subscribe(() => {
            setData(store.get().giftCards);
        });
        return unsubscribe;
    }, [store]);
    
    const setGiftCards: StoreUpdater<AppState['giftCards']> = (updater) => {
        store.set(s => ({ ...s, giftCards: updater(s.giftCards) }));
    };

    return { data, setData: setGiftCards, isClient };
};

export const useBeautyData = () => {
    const store = useContext(StoreContext);
    if (!store) throw new Error("useBeautyData must be used within a StoreProvider.");
    const [state, setState] = useState({
        agencies: store.get().beautyCenters,
        services: store.get().beautyServices,
        appointments: store.get().beautyAppointments,
        isClient: store.get().isClient
    });

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const currentState = store.get();
            setState({
                agencies: currentState.beautyCenters,
                services: currentState.beautyServices,
                appointments: currentState.beautyAppointments,
                isClient: currentState.isClient,
            });
        });
        return unsubscribe;
    }, [store]);
    
    const setAgencies: StoreUpdater<AppState['beautyCenters']> = (updater) => store.set(s => ({ ...s, beautyCenters: updater(s.beautyCenters) }));
    const setServices: StoreUpdater<AppState['beautyServices']> = (updater) => store.set(s => ({ ...s, beautyServices: updater(s.beautyServices) }));
    const setAppointments: StoreUpdater<AppState['beautyAppointments']> = (updater) => store.set(s => ({ ...s, beautyAppointments: updater(s.beautyAppointments) }));

    return { ...state, setAgencies, setServices, setAppointments };
};
