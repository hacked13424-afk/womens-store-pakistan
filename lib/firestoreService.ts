import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  setDoc,
  onSnapshot,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Category, Order, Review, SiteSettings } from './types';
import { defaultProducts, defaultCategories, defaultSiteSettings } from './mockData';

// ── Products ───────────────────────────────────────────────────────────────

/** Fetch all products. Falls back to mock data when Firestore is unavailable or empty. */
export async function getProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, 'products'));
    if (snap.empty) return defaultProducts;
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
  } catch {
    return defaultProducts;
  }
}

/** Fetch a single product by ID. Falls back to mock data on error. */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'products', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) return { id: snap.id, ...snap.data() } as Product;
    return defaultProducts.find(p => p.id === id) || null;
  } catch {
    return defaultProducts.find(p => p.id === id) || null;
  }
}

/** Add a new product document and return the generated Firestore ID. */
export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
}

/** Partially update an existing product and stamp updatedAt. */
export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, 'products', id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

/** Permanently remove a product document. */
export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}

// ── Categories ─────────────────────────────────────────────────────────────

/** Fetch all categories. Falls back to mock data when Firestore is unavailable or empty. */
export async function getCategories(): Promise<Category[]> {
  try {
    const snap = await getDocs(collection(db, 'categories'));
    if (snap.empty) return defaultCategories;
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
  } catch {
    return defaultCategories;
  }
}

/** Add a new category and return its generated ID. */
export async function addCategory(category: Omit<Category, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'categories'), {
    ...category,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

/** Partially update a category document. */
export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  await updateDoc(doc(db, 'categories', id), data);
}

/** Permanently remove a category document. */
export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, 'categories', id));
}

// ── Orders ─────────────────────────────────────────────────────────────────

/**
 * Create a new order in Firestore.
 * Generates a human-readable order ID in the format WSP-XXXXXXXX.
 * Returns the generated orderId string (not the Firestore document ID).
 */
export async function placeOrder(
  order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const orderId = 'WSP-' + Date.now().toString(36).toUpperCase();
  await addDoc(collection(db, 'orders'), {
    ...order,
    orderId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return orderId;
}

/** Fetch all orders sorted newest-first. Returns empty array on error. */
export async function getOrders(): Promise<Order[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
  } catch {
    return [];
  }
}

/** Update the lifecycle status of an existing order. */
export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  await updateDoc(doc(db, 'orders', id), {
    status,
    updatedAt: new Date().toISOString(),
  });
}

// ── Reviews ────────────────────────────────────────────────────────────────

/** Fetch all reviews for a specific product. Returns empty array on error. */
export async function getReviews(productId: string): Promise<Review[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'reviews'), where('productId', '==', productId))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
  } catch {
    return [];
  }
}

/** Add a new customer review and return the Firestore document ID. */
export async function addReview(review: Omit<Review, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'reviews'), {
    ...review,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

// ── Site Settings ──────────────────────────────────────────────────────────

/**
 * Fetch the singleton site settings document.
 * Falls back to hard-coded defaults when Firestore is unavailable.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'site'));
    if (snap.exists()) return { id: snap.id, ...snap.data() } as SiteSettings;
    return defaultSiteSettings;
  } catch {
    return defaultSiteSettings;
  }
}

/**
 * Merge-update the singleton site settings document.
 * Creates the document if it does not yet exist.
 */
export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  await setDoc(
    doc(db, 'settings', 'site'),
    { ...settings, updatedAt: new Date().toISOString() },
    { merge: true }
  );
}

// ── Real-time Admin Subscriptions ──────────────────────────────────────────

/**
 * Subscribe to the 20 most recent orders in real-time.
 * Calls `callback` immediately with current data and again on each change.
 * Returns an unsubscribe function — call it in your cleanup / useEffect return.
 */
export function subscribeToNewOrders(callback: (orders: Order[]) => void): () => void {
  const q = query(
    collection(db, 'orders'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  return onSnapshot(q, snap => {
    const orders = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
    callback(orders);
  });
}
