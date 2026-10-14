export interface Product {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  category: string;
  stock: number;
  inStock: boolean;
  images: string[];    // URLs or /public paths
  videoUrl?: string;
  featured: boolean;
  sizes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  active: boolean;
  order: number;
  createdAt: string;
}

export interface Order {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  orderMethod: 'website' | 'whatsapp';
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  verified: boolean;
  createdAt: string;
}

export interface SiteSettings {
  id?: string;
  whatsappNumber: string;
  supportEmail: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  businessHours: string;
  supportInfo: string;
  announcementBanner: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  product: Product;
}

export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
}

export interface Notification {
  id: string;
  type: 'website_order' | 'whatsapp_order';
  message: string;
  orderId: string;
  read: boolean;
  createdAt: string;
}
