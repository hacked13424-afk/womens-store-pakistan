'use client';
import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { CartItem, WishlistItem, Product, Category, Order, SiteSettings, Notification } from './types';
import { defaultProducts, defaultCategories, defaultSiteSettings } from './mockData';

// ── Audio Chime Helper ───────────────────────────────────────────────────────
export function playNotificationSound() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Tone 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.3);

    // Tone 2 (higher bell chime)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.12); // B5
    gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.warn('Audio chime could not be played:', e);
  }
}

// ── State Shape ────────────────────────────────────────────────────────────
interface AppState {
  products: Product[];
  categories: Category[];
  siteSettings: SiteSettings;
  orders: Order[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  notifications: Notification[];
  unreadCount: number;
  isCartOpen: boolean;
  searchQuery: string;
  isAdminAuthenticated: boolean;
  isHydrated: boolean;
}

// ── Action Union ───────────────────────────────────────────────────────────
type Action =
  | { type: 'HYDRATE'; payload: Partial<AppState> }
  | { type: 'SET_PRODUCTS'; products: Product[] }
  | { type: 'ADD_PRODUCT'; product: Product }
  | { type: 'UPDATE_PRODUCT'; product: Product }
  | { type: 'DELETE_PRODUCT'; productId: string }
  | { type: 'SET_CATEGORIES'; categories: Category[] }
  | { type: 'ADD_CATEGORY'; category: Category }
  | { type: 'UPDATE_CATEGORY'; category: Category }
  | { type: 'DELETE_CATEGORY'; categoryId: string }
  | { type: 'UPDATE_SETTINGS'; settings: SiteSettings }
  | { type: 'ADD_ORDER'; order: Order }
  | { type: 'UPDATE_ORDER_STATUS'; orderId: string; status: Order['status'] }
  | { type: 'DELETE_ORDER'; orderId: string }
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_WISHLIST'; product: Product }
  | { type: 'ADD_NOTIFICATION'; notification: Notification }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'SET_ADMIN_AUTH'; authenticated: boolean };

const initialOrders: Order[] = [
  {
    id: 'ord-1',
    orderId: 'WSP-M18K9P',
    productId: 'prod-1',
    productTitle: 'Matte Nude & Rose Lipstick Set (6 Shades)',
    productPrice: 1200,
    customerName: 'Ayesha Khan',
    customerPhone: '03001234567',
    deliveryAddress: 'House 45, Street 12, Phase 5, DHA',
    city: 'Lahore',
    orderMethod: 'website',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'ord-2',
    orderId: 'WSP-WA772X',
    productId: 'prod-2',
    productTitle: 'Royal Kundan Bridal Jewelry Set',
    productPrice: 2800,
    customerName: 'Zainab Bibi',
    customerPhone: '03219876543',
    deliveryAddress: 'Flat 302, Gulshan-e-Iqbal Block 13D',
    city: 'Karachi',
    orderMethod: 'whatsapp',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'ord-3',
    orderId: 'WSP-L994B1',
    productId: 'prod-3',
    productTitle: 'Embroidered Floral Lawn 3-Piece Suit',
    productPrice: 3800,
    customerName: 'Maryam Noor',
    customerPhone: '03335551234',
    deliveryAddress: 'Sector F-10/2, Street 33, House 14',
    city: 'Islamabad',
    orderMethod: 'website',
    status: 'dispatched',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'website_order',
    message: 'New COD Order WSP-M18K9P placed by Ayesha Khan (Rs. 1,200)',
    orderId: 'WSP-M18K9P',
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'notif-2',
    type: 'whatsapp_order',
    message: 'New WhatsApp Order WSP-WA772X initiated by Zainab Bibi (Rs. 2,800)',
    orderId: 'WSP-WA772X',
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  }
];

const initialState: AppState = {
  products: defaultProducts,
  categories: defaultCategories,
  siteSettings: defaultSiteSettings,
  orders: initialOrders,
  cart: [],
  wishlist: [],
  notifications: initialNotifications,
  unreadCount: 2,
  isCartOpen: false,
  searchQuery: '',
  isAdminAuthenticated: false,
  isHydrated: false,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, isHydrated: true };

    case 'SET_PRODUCTS':
      return { ...state, products: action.products };

    case 'ADD_PRODUCT':
      return { ...state, products: [action.product, ...state.products] };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.product.id ? action.product : p),
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.productId),
      };

    case 'SET_CATEGORIES':
      return { ...state, categories: action.categories };

    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.category] };

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c => c.id === action.category.id ? action.category : c),
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.categoryId),
      };

    case 'UPDATE_SETTINGS':
      return { ...state, siteSettings: action.settings };

    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.order, ...state.orders],
      };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o => o.id === action.orderId || o.orderId === action.orderId ? { ...o, status: action.status, updatedAt: new Date().toISOString() } : o),
      };

    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(o => o.id !== action.orderId && o.orderId !== action.orderId),
      };

    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.product.id === action.product.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i =>
            i.product.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, cart: [...state.cart, { product: action.product, quantity: 1 }] };
    }

    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.product.id !== action.productId) };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart
          .map(i => i.product.id === action.productId ? { ...i, quantity: action.quantity } : i)
          .filter(i => i.quantity > 0),
      };

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'TOGGLE_WISHLIST': {
      const inWishlist = state.wishlist.some(i => i.productId === action.product.id);
      if (inWishlist) {
        return { ...state, wishlist: state.wishlist.filter(i => i.productId !== action.product.id) };
      }
      return {
        ...state,
        wishlist: [...state.wishlist, { productId: action.product.id, product: action.product }],
      };
    }

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };

    case 'MARK_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      };

    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };

    case 'SET_ADMIN_AUTH':
      return { ...state, isAdminAuthenticated: action.authenticated };

    default:
      return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('wsp_products');
      const storedCategories = localStorage.getItem('wsp_categories');
      const storedSettings = localStorage.getItem('wsp_settings');
      const storedOrders = localStorage.getItem('wsp_orders');
      const storedCart = localStorage.getItem('wsp_cart');
      const storedWishlist = localStorage.getItem('wsp_wishlist');
      const storedAuth = localStorage.getItem('wsp_admin_auth');

      const payload: Partial<AppState> = {};
      if (storedProducts) payload.products = JSON.parse(storedProducts);
      if (storedCategories) payload.categories = JSON.parse(storedCategories);
      if (storedSettings) payload.siteSettings = JSON.parse(storedSettings);
      if (storedOrders) payload.orders = JSON.parse(storedOrders);
      if (storedCart) payload.cart = JSON.parse(storedCart);
      if (storedWishlist) payload.wishlist = JSON.parse(storedWishlist);
      if (storedAuth) payload.isAdminAuthenticated = JSON.parse(storedAuth);

      dispatch({ type: 'HYDRATE', payload });
    } catch (e) {
      console.warn('Hydration error:', e);
      dispatch({ type: 'HYDRATE', payload: {} });
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!state.isHydrated) return;
    try {
      localStorage.setItem('wsp_products', JSON.stringify(state.products));
      localStorage.setItem('wsp_categories', JSON.stringify(state.categories));
      localStorage.setItem('wsp_settings', JSON.stringify(state.siteSettings));
      localStorage.setItem('wsp_orders', JSON.stringify(state.orders));
      localStorage.setItem('wsp_cart', JSON.stringify(state.cart));
      localStorage.setItem('wsp_wishlist', JSON.stringify(state.wishlist));
      localStorage.setItem('wsp_admin_auth', JSON.stringify(state.isAdminAuthenticated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [state.products, state.categories, state.siteSettings, state.orders, state.cart, state.wishlist, state.isAdminAuthenticated, state.isHydrated]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}

// ── Domain Hooks ───────────────────────────────────────────────────────────

export function useProducts() {
  const { state, dispatch } = useAppStore();

  const addProduct = useCallback((product: Product) => {
    dispatch({ type: 'ADD_PRODUCT', product });
  }, [dispatch]);

  const updateProduct = useCallback((product: Product) => {
    dispatch({ type: 'UPDATE_PRODUCT', product });
  }, [dispatch]);

  const deleteProduct = useCallback((productId: string) => {
    dispatch({ type: 'DELETE_PRODUCT', productId });
  }, [dispatch]);

  return {
    products: state.products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}

export function useCategories() {
  const { state, dispatch } = useAppStore();

  const addCategory = useCallback((category: Category) => {
    dispatch({ type: 'ADD_CATEGORY', category });
  }, [dispatch]);

  const updateCategory = useCallback((category: Category) => {
    dispatch({ type: 'UPDATE_CATEGORY', category });
  }, [dispatch]);

  const deleteCategory = useCallback((categoryId: string) => {
    dispatch({ type: 'DELETE_CATEGORY', categoryId });
  }, [dispatch]);

  return {
    categories: state.categories,
    activeCategories: state.categories.filter(c => c.active),
    addCategory,
    updateCategory,
    deleteCategory,
  };
}

export function useSiteSettings() {
  const { state, dispatch } = useAppStore();

  const updateSettings = useCallback((settings: SiteSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', settings });
  }, [dispatch]);

  return {
    settings: state.siteSettings,
    updateSettings,
  };
}

export function useOrders() {
  const { state, dispatch } = useAppStore();

  const createOrder = useCallback((orderData: Omit<Order, 'id' | 'orderId' | 'createdAt' | 'updatedAt'>) => {
    const id = 'ord-' + Date.now();
    const orderId = 'WSP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...orderData,
      id,
      orderId,
      createdAt: now,
      updatedAt: now,
    };

    dispatch({ type: 'ADD_ORDER', order: newOrder });

    // Audio chime notification!
    playNotificationSound();

    // In-app visual notification
    const notif: Notification = {
      id: 'notif-' + Date.now(),
      type: orderData.orderMethod === 'whatsapp' ? 'whatsapp_order' : 'website_order',
      message: `New ${orderData.orderMethod === 'whatsapp' ? 'WhatsApp' : 'COD'} Order ${orderId} by ${orderData.customerName} (Rs. ${orderData.productPrice.toLocaleString()})`,
      orderId,
      read: false,
      createdAt: now,
    };
    dispatch({ type: 'ADD_NOTIFICATION', notification: notif });

    return orderId;
  }, [dispatch]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', orderId, status });
  }, [dispatch]);

  const deleteOrder = useCallback((orderId: string) => {
    dispatch({ type: 'DELETE_ORDER', orderId });
  }, [dispatch]);

  return {
    orders: state.orders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
  };
}

export function useCart() {
  const { state, dispatch } = useAppStore();

  const addToCart = useCallback((product: Product) => dispatch({ type: 'ADD_TO_CART', product }), [dispatch]);
  const removeFromCart = useCallback((productId: string) => dispatch({ type: 'REMOVE_FROM_CART', productId }), [dispatch]);
  const updateQuantity = useCallback((productId: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', productId, quantity }), [dispatch]);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [dispatch]);
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), [dispatch]);

  const total = state.cart.reduce((sum, i) => sum + i.product.salePrice * i.quantity, 0);
  const itemCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);

  return {
    cart: state.cart,
    isCartOpen: state.isCartOpen,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
  };
}

export function useWishlist() {
  const { state, dispatch } = useAppStore();
  const toggleWishlist = useCallback((product: Product) => dispatch({ type: 'TOGGLE_WISHLIST', product }), [dispatch]);
  const isInWishlist = (productId: string) => state.wishlist.some(i => i.productId === productId);
  return { wishlist: state.wishlist, toggleWishlist, isInWishlist };
}

export function useNotifications() {
  const { state, dispatch } = useAppStore();
  const addNotification = useCallback((notification: Notification) => dispatch({ type: 'ADD_NOTIFICATION', notification }), [dispatch]);
  const markRead = useCallback(() => dispatch({ type: 'MARK_NOTIFICATIONS_READ' }), [dispatch]);
  return { notifications: state.notifications, unreadCount: state.unreadCount, addNotification, markRead };
}

export function useAdminAuth() {
  const { state, dispatch } = useAppStore();
  const setAuthenticated = useCallback((authenticated: boolean) => {
    dispatch({ type: 'SET_ADMIN_AUTH', authenticated });
  }, [dispatch]);
  return { isAuthenticated: state.isAdminAuthenticated, setAuthenticated };
}
