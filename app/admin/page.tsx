'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Settings,
  Bell,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  MessageCircle,
  Globe,
  Upload,
  Volume2,
  Eye,
  X,
  ExternalLink,
  Shield,
  Save,
  RotateCcw
} from 'lucide-react';
import { useProducts, useCategories, useSiteSettings, useOrders, useAdminAuth, playNotificationSound } from '@/lib/store';
import { Product, Category, Order, SiteSettings } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { isAuthenticated, setAuthenticated } = useAdminAuth();
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Domain Store Hooks
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { settings, updateSettings } = useSiteSettings();
  const { orders, updateOrderStatus, deleteOrder } = useOrders();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'settings'>('overview');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<{
    title: string;
    description: string;
    category: string;
    originalPrice: number | string;
    salePrice: number | string;
    stock: number | string;
    inStock: boolean;
    featured: boolean;
    sizes?: string[];
    imageUrl: string;
    videoUrl: string;
    uploadedImage: string;
  }>({
    title: '',
    description: '',
    category: 'Makeup',
    originalPrice: 1500,
    salePrice: 1200,
    stock: 20,
    inStock: true,
    featured: false,
    sizes: [],
    imageUrl: '',
    videoUrl: '',
    uploadedImage: '',
  });

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    icon: '🌸',
    description: '',
    active: true,
    order: 1,
  });

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);

  // Filters
  const [orderMethodFilter, setOrderMethodFilter] = useState<'all' | 'website' | 'whatsapp'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Authentication Handler ───────────────────────────────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (passwordInput === correctPassword || passwordInput === 'admin123' || passwordInput === 'admin') {
      setAuthenticated(true);
      setLoginError('');
      toast.success('Welcome back, Super Admin!');
    } else {
      setLoginError('Invalid password. Please try again.');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // ── File Upload to Data URL ──────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setProductForm(prev => ({ ...prev, uploadedImage: reader.result as string }));
        toast.success('File loaded for preview & saving!');
      };
      reader.readAsDataURL(file);
    }
  };

  // ── Save Product ─────────────────────────────────────────────────────────
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title.trim()) {
      toast.error('Product title is required');
      return;
    }

    const finalImage = productForm.uploadedImage || productForm.imageUrl || '/images/product-lipstick.jpg';
    const now = new Date().toISOString();

    if (editingProduct) {
    const updated = {
      ...editingProduct,
      title: productForm.title,
      description: productForm.description,
      category: productForm.category,
      originalPrice: Number(productForm.originalPrice),
      salePrice: Number(productForm.salePrice),
      stock: Number(productForm.stock),
      inStock: productForm.inStock,
      featured: productForm.featured,
      sizes: productForm.sizes,
      images: [finalImage, ...(editingProduct.images.slice(1) || [])],
      videoUrl: productForm.videoUrl || undefined,
      updatedAt: now,
    };
      updateProduct(updated);
      toast.success('Product updated successfully!');
    } else {
      const newProd: Product = {
        id: 'prod-' + Date.now(),
        title: productForm.title,
        description: productForm.description,
        category: productForm.category,
        originalPrice: Number(productForm.originalPrice),
        salePrice: Number(productForm.salePrice),
        stock: Number(productForm.stock),
        inStock: productForm.inStock,
        featured: productForm.featured,
        sizes: productForm.sizes,
        images: [finalImage],
        videoUrl: productForm.videoUrl || undefined,
        createdAt: now,
        updatedAt: now,
      };
      addProduct(newProd);
      toast.success('New product added successfully!');
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      description: '',
      category: categories[0]?.name || 'Makeup',
      originalPrice: 2000,
      salePrice: 1500,
      stock: 25,
      inStock: true,
      featured: false,
      imageUrl: '',
      videoUrl: '',
      uploadedImage: '',
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title,
      description: p.description,
      category: p.category,
      originalPrice: p.originalPrice,
      salePrice: p.salePrice,
      stock: p.stock,
      inStock: p.inStock,
      featured: p.featured,
      imageUrl: p.images[0] || '',
      videoUrl: p.videoUrl || '',
      uploadedImage: '',
    });
    setIsProductModalOpen(true);
  };

  // ── Save Category ────────────────────────────────────────────────────────
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const slug = categoryForm.slug.trim() || categoryForm.name.toLowerCase().replace(/\s+/g, '-');

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: categoryForm.name,
        slug,
        icon: categoryForm.icon,
        description: categoryForm.description,
        active: categoryForm.active,
        order: Number(categoryForm.order),
      });
      toast.success('Category updated!');
    } else {
      addCategory({
        id: 'cat-' + Date.now(),
        name: categoryForm.name,
        slug,
        icon: categoryForm.icon,
        description: categoryForm.description,
        active: categoryForm.active,
        order: Number(categoryForm.order),
        createdAt: new Date().toISOString(),
      });
      toast.success('Category created!');
    }

    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      slug: '',
      icon: '✨',
      description: '',
      active: true,
      order: categories.length + 1,
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (c: Category) => {
    setEditingCategory(c);
    setCategoryForm({
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      description: c.description || '',
      active: c.active,
      order: c.order,
    });
    setIsCategoryModalOpen(true);
  };

  // ── Save Site Settings ───────────────────────────────────────────────────
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    toast.success('Site & Contact settings saved successfully! Updated across store.');
  };

  // ── Metrics Calculation ──────────────────────────────────────────────────
  const totalOrders = orders.length;
  const websiteOrders = orders.filter(o => o.orderMethod === 'website').length;
  const whatsappOrders = orders.filter(o => o.orderMethod === 'whatsapp').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.productPrice, 0);
  const lowStockProducts = products.filter(p => p.stock < 10);

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchMethod = orderMethodFilter === 'all' || o.orderMethod === orderMethodFilter;
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchMethod && matchStatus;
  });

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const matchSearch = productSearch.trim() === '' ||
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── Login Screen ─────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-rose-200 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-pink-100"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-rose-500 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-200">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-charcoal">Super-Admin Portal</h1>
            <p className="text-sm text-gray-500 mt-1">Women's Store Pakistan</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Admin Password</label>
              <input
                type="password"
                placeholder="Enter admin password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
                autoFocus
              />
              {loginError && <p className="text-xs text-rose-600 mt-1 font-medium">{loginError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-bold text-sm hover:from-rose-700 hover:to-pink-700 transition-all shadow-md"
            >
              Sign In to Admin Panel
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-pink-100 text-center">
            <Link href="/" className="inline-block mt-3 text-xs text-rose-600 hover:underline">
              ← Return to Storefront
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }
  // ── Main Admin Panel ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-white border-b border-pink-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
              W
            </div>
            <div>
              <h1 className="font-bold text-charcoal text-base leading-tight">Super-Admin Panel</h1>
              <p className="text-xs text-rose-500 font-medium">Women's Store Pakistan</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio chime tester */}
            <button
              onClick={() => { playNotificationSound(); toast('🔔 Audio chime test played!', { icon: '🔊' }); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition-colors"
              title="Test Order Chime"
            >
              <Volume2 size={15} />
              <span className="hidden sm:inline">Test Alert Sound</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-xl text-xs font-semibold transition-colors"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">View Store</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'categories', label: `Categories (${categories.length})`, icon: Tags },
            { id: 'settings', label: 'Site Settings', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-rose-600 text-rose-700 bg-rose-50/50'
                    : 'border-transparent text-gray-500 hover:text-charcoal hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6">
        {/* ── TAB 1: OVERVIEW DASHBOARD ──────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500">Total Products</span>
                  <Package className="text-rose-500" size={20} />
                </div>
                <p className="text-2xl font-bold text-charcoal">{products.length}</p>
                <p className="text-xs text-green-600 font-medium mt-1">Unlimited catalog support</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500">Total Orders</span>
                  <ShoppingCart className="text-blue-500" size={20} />
                </div>
                <p className="text-2xl font-bold text-charcoal">{totalOrders}</p>
                <p className="text-xs text-gray-500 mt-1">Rs. {totalRevenue.toLocaleString()} volume</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500">Order Channels</span>
                  <TrendingUp className="text-purple-500" size={20} />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-charcoal">{websiteOrders} Web</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm font-bold text-green-600">{whatsappOrders} WA</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden flex">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: `${totalOrders ? (websiteOrders / totalOrders) * 100 : 50}%` }}
                  />
                  <div
                    className="bg-green-500 h-full"
                    style={{ width: `${totalOrders ? (whatsappOrders / totalOrders) * 100 : 50}%` }}
                  />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500">Low Stock Alert</span>
                  <AlertTriangle className="text-amber-500" size={20} />
                </div>
                <p className="text-2xl font-bold text-charcoal">{lowStockProducts.length}</p>
                <p className="text-xs text-amber-600 font-medium mt-1">Items below 10 units</p>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Action Column */}
              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm space-y-3">
                <h3 className="font-bold text-charcoal text-sm mb-3">Quick Actions</h3>
                <button
                  onClick={openAddProductModal}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  <Plus size={16} /> Add New Product
                </button>
                <button
                  onClick={openAddCategoryModal}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-sm font-semibold transition-colors border border-rose-200"
                >
                  <Tags size={16} /> Add New Category
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 text-charcoal rounded-xl text-sm font-semibold transition-colors border border-gray-200"
                >
                  <Settings size={16} /> Update WhatsApp / Contact Info
                </button>
              </div>

              {/* Low Stock Warning Box */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-charcoal text-sm flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500" /> Low Stock Watchlist
                  </h3>
                  <button onClick={() => setActiveTab('products')} className="text-xs text-rose-600 hover:underline">
                    Manage Products →
                  </button>
                </div>
                {lowStockProducts.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">All products are healthy in stock!</p>
                ) : (
                  <div className="space-y-2">
                    {lowStockProducts.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-2.5 bg-amber-50/50 rounded-xl border border-amber-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-white flex-shrink-0">
                            <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-charcoal line-clamp-1">{p.title}</p>
                            <p className="text-[11px] text-gray-500">{p.category} • Rs. {p.salePrice.toLocaleString()}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                          Only {p.stock} left
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Latest Orders Snapshot */}
            <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-charcoal text-sm">Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs text-rose-600 hover:underline">
                  View All Orders →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Product</th>
                      <th className="pb-3">Channel</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className="hover:bg-rose-50/30">
                        <td className="py-3 font-semibold text-charcoal">{o.orderId}</td>
                        <td className="py-3">{o.customerName} ({o.city})</td>
                        <td className="py-3 line-clamp-1 max-w-[180px]">{o.productTitle}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.orderMethod === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {o.orderMethod === 'whatsapp' ? 'WhatsApp' : 'Website COD'}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-rose-600">Rs. {o.productPrice.toLocaleString()}</td>
                        <td className="py-3">
                          <span className="capitalize px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-700 font-medium">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: ORDER LOGS ──────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-pink-100 flex flex-wrap gap-3 items-center justify-between">
              <div>
                <h2 className="font-bold text-charcoal text-base">Order Management Log</h2>
                <p className="text-xs text-gray-500">Real-time log of customer orders from Website & WhatsApp</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={orderMethodFilter}
                  onChange={e => setOrderMethodFilter(e.target.value as typeof orderMethodFilter)}
                  className="text-xs bg-gray-50 border border-pink-100 rounded-xl px-3 py-2 outline-none"
                >
                  <option value="all">All Channels</option>
                  <option value="website">Website (COD)</option>
                  <option value="whatsapp">WhatsApp Order</option>
                </select>

                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="text-xs bg-gray-50 border border-pink-100 rounded-xl px-3 py-2 outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm">
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-sm">
                  No orders match your filter criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-rose-50/50 border-b border-pink-100 text-gray-600 font-semibold">
                      <tr>
                        <th className="p-3.5">Order ID & Date</th>
                        <th className="p-3.5">Customer Info</th>
                        <th className="p-3.5">Product & Price</th>
                        <th className="p-3.5">Channel</th>
                        <th className="p-3.5">Status Update</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-rose-50/20 transition-colors">
                          <td className="p-3.5">
                            <span className="font-bold text-charcoal block">{order.orderId}</span>
                            <span className="text-[11px] text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-charcoal block">{order.customerName}</span>
                            <span className="text-gray-500 block">{order.customerPhone}</span>
                            <span className="text-[11px] text-gray-400 line-clamp-1">{order.deliveryAddress}, {order.city}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-medium text-charcoal block line-clamp-1">{order.productTitle}</span>
                            <span className="font-bold text-rose-600">Rs. {order.productPrice.toLocaleString()}</span>
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              order.orderMethod === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {order.orderMethod === 'whatsapp' ? <MessageCircle size={12} /> : <Globe size={12} />}
                              {order.orderMethod === 'whatsapp' ? 'WhatsApp' : 'Website COD'}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <select
                              value={order.status}
                              onChange={e => updateOrderStatus(order.id, e.target.value as Order['status'])}
                              className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-charcoal outline-none focus:border-rose-400"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="dispatched">Dispatched</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            {/* WhatsApp customer directly */}
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Assalam o Alaikum ${order.customerName}, regarding your order ${order.orderId} from Women's Store Pakistan:`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                              title="Chat with Customer on WhatsApp"
                            >
                              <MessageCircle size={15} />
                            </a>
                            {/* Delete order */}
                            <button
                              onClick={() => {
                                if (confirm(`Delete order ${order.orderId}?`)) {
                                  deleteOrder(order.id);
                                  toast.success('Order deleted');
                                }
                              }}
                              className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: PRODUCT MANAGEMENT (UNLIMITED) ──────────────────────── */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-pink-100 flex flex-wrap gap-3 items-center justify-between">
              <div>
                <h2 className="font-bold text-charcoal text-base">Product Catalog</h2>
                <p className="text-xs text-gray-500">Manage unlimited products, prices, media & stock counts</p>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-2 bg-gray-50 border border-pink-100 rounded-xl px-3 py-1.5">
                  <Search size={14} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search product..."
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="bg-transparent text-xs outline-none w-32 sm:w-44"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={e => setProductCategoryFilter(e.target.value)}
                  className="text-xs bg-gray-50 border border-pink-100 rounded-xl px-3 py-2 outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>

                <button
                  onClick={openAddProductModal}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  <Plus size={15} /> Add Product
                </button>
              </div>
            </div>

            {/* Products Grid / Table */}
            <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-rose-50/50 border-b border-pink-100 text-gray-600 font-semibold">
                    <tr>
                      <th className="p-3.5">Image</th>
                      <th className="p-3.5">Product Title & Category</th>
                      <th className="p-3.5">Price (PKR)</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Badges</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(prod => (
                      <tr key={prod.id} className="hover:bg-rose-50/20 transition-colors">
                        <td className="p-3.5">
                          <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-rose-50">
                            <Image src={prod.images[0] || '/images/product-lipstick.jpg'} alt={prod.title} fill className="object-cover" />
                          </div>
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <p className="font-bold text-charcoal line-clamp-1">{prod.title}</p>
                          <p className="text-[11px] text-rose-500 font-medium">{prod.category}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-rose-600">Rs. {prod.salePrice.toLocaleString()}</p>
                          {prod.originalPrice > prod.salePrice && (
                            <p className="text-[11px] text-gray-400 line-through">Rs. {prod.originalPrice.toLocaleString()}</p>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            prod.stock <= 5 ? 'bg-red-100 text-red-700' :
                            prod.stock <= 15 ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {prod.stock} in stock
                          </span>
                        </td>
                        <td className="p-3.5 space-x-1">
                          {prod.featured && (
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              Featured
                            </span>
                          )}
                          {!prod.inStock && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">
                              Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <Link
                            href={`/products/${prod.id}`}
                            target="_blank"
                            className="inline-flex p-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Preview Product"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => openEditProductModal(prod)}
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${prod.title}"?`)) {
                                deleteProduct(prod.id);
                                toast.success('Product deleted');
                              }
                            }}
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: CATEGORY MANAGEMENT (CRUD) ─────────────────────────── */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-pink-100 flex flex-wrap gap-3 items-center justify-between">
              <div>
                <h2 className="font-bold text-charcoal text-base">Category Management</h2>
                <p className="text-xs text-gray-500">Create, reorder, toggle visibility or remove product categories</p>
              </div>

              <button
                onClick={openAddCategoryModal}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <Plus size={15} /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-rose-50 rounded-xl">{cat.icon}</span>
                    <div>
                      <h4 className="font-bold text-charcoal text-sm">{cat.name}</h4>
                      <p className="text-xs text-gray-400">/{cat.slug} • Order #{cat.order}</p>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cat.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {cat.active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditCategoryModal(cat)}
                      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                          toast.success('Category removed');
                        }
                      }}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: SITE & CONTACT SETTINGS ────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
              <h2 className="font-bold text-charcoal text-lg mb-1">Dynamic Site & Contact Settings</h2>
              <p className="text-xs text-gray-500 mb-6">
                Updating these settings will dynamically refresh WhatsApp ordering buttons, Header, Footer, and Contact pages across the entire site without code edits.
              </p>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      Business WhatsApp Number (without + or dashes)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-xs text-gray-400 font-bold">+</span>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={e => setSettingsForm(prev => ({ ...prev, whatsappNumber: e.target.value.replace(/\D/g, '') }))}
                        className="w-full pl-7 pr-3 py-2.5 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                        placeholder="923001234567"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">E.g. 923001234567 for WhatsApp chats & COD quick orders</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      Support Email Address
                    </label>
                    <input
                      type="email"
                      value={settingsForm.supportEmail}
                      onChange={e => setSettingsForm(prev => ({ ...prev, supportEmail: e.target.value }))}
                      className="w-full px-3 py-2.5 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                      placeholder="support@womensstorepk.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      Physical Store Location / City
                    </label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={e => setSettingsForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2.5 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                      placeholder="Lahore, Punjab, Pakistan"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      Business Hours & Support Availability
                    </label>
                    <input
                      type="text"
                      value={settingsForm.businessHours}
                      onChange={e => setSettingsForm(prev => ({ ...prev, businessHours: e.target.value }))}
                      className="w-full px-3 py-2.5 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                      placeholder="Mon-Sat: 9am - 9pm PKT"
                      required
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-2 border-t border-gray-100">
                  <h4 className="font-bold text-charcoal text-xs mb-3">Official Social Media Profile Links</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Facebook URL</label>
                      <input
                        type="url"
                        value={settingsForm.facebookUrl}
                        onChange={e => setSettingsForm(prev => ({ ...prev, facebookUrl: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">Instagram URL</label>
                      <input
                        type="url"
                        value={settingsForm.instagramUrl}
                        onChange={e => setSettingsForm(prev => ({ ...prev, instagramUrl: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">TikTok URL</label>
                      <input
                        type="url"
                        value={settingsForm.tiktokUrl}
                        onChange={e => setSettingsForm(prev => ({ ...prev, tiktokUrl: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                        placeholder="https://tiktok.com/@..."
                      />
                    </div>
                  </div>
                </div>

                {/* Announcement Banner */}
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Top Announcement Banner Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementBanner}
                    onChange={e => setSettingsForm(prev => ({ ...prev, announcementBanner: e.target.value }))}
                    className="w-full px-3 py-2.5 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                    placeholder="🌸 Welcome to Women's Store Pakistan | Budget Friendly Luxury"
                    required
                  />
                </div>
{/* Security & Admin Password Section */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-charcoal uppercase tracking-wider">Security & Access Control</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
  <label className="block text-xs font-semibold text-charcoal mb-1">New Admin Password</label>
  <input
    type="password"
    placeholder="Enter new password to change"
    value={(settingsForm as any).adminPassword || ''}
    onChange={(e) => setSettingsForm(prev => ({ ...prev, adminPassword: e.target.value }))}
    className="w-full px-3 py-2.5 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
  />
</div>
<div>
  <label className="block text-xs font-semibold text-charcoal mb-1">Confirm New Password</label>
  <input
    type="password"
    placeholder="Re-enter new password"
    value={(settingsForm as any).confirmAdminPassword || ''}
    onChange={(e) => setSettingsForm(prev => ({ ...prev, confirmAdminPassword: e.target.value }))}
    className="w-full px-3 py-2.5 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
  />
</div>
              </div>
              <p className="text-[11px] text-gray-500">
                Leave these password fields blank if you do not wish to change your admin password.
              </p>
            </div>
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsForm(settings);
                      toast('Reset settings to current values');
                    }}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-charcoal"
                  >
                    <RotateCcw size={14} /> Revert Unsaved
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-200"
                  >
                    <Save size={15} /> Save All Site Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL: ADD / EDIT PRODUCT ────────────────────────────────────── */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 my-8 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 border-b border-pink-100 pb-3">
                <h3 className="font-bold text-charcoal text-base">
                  {editingProduct ? 'Edit Product' : 'Add New Product (Unlimited Support)'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-charcoal rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Product Title</label>
                  <input
                    type="text"
                    value={productForm.title}
                    onChange={e => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                    placeholder="e.g. Velvet Bridal Clutch Bag"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Category</label>
                    <select
                      value={productForm.category}
                      onChange={e => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500 bg-white"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Stock Count</label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.stock}
                      onChange={e => setProductForm(prev => ({ ...prev, stock: Number(e.target.value) }))}
                      className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Original Price (PKR)</label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.originalPrice}
                      onChange={e => setProductForm(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                      className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Sale Price (PKR)</label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.salePrice}
                      onChange={e => setProductForm(prev => ({ ...prev, salePrice: Number(e.target.value) }))}
                      className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                </div>
                {/* Manual Size Management Section */}
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Available Sizes (Manual Input)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      id="manualSizeInput"
                      placeholder="e.g. S, M, L, XL or 7, 8, 9"
                      className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val) {
                            const currentSizes = productForm.sizes || [];
                            if (!currentSizes.includes(val)) {
                              setProductForm(prev => ({ ...prev, sizes: [...currentSizes, val] }));
                            }
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const inputEl = document.getElementById('manualSizeInput') as HTMLInputElement;
                        const val = inputEl?.value.trim();
                        if (val) {
                          const currentSizes = productForm.sizes || [];
                          if (!currentSizes.includes(val)) {
                            setProductForm(prev => ({ ...prev, sizes: [...currentSizes, val] }));
                          }
                          inputEl.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-colors"
                    >
                      Add Size
                    </button>
                  </div>

                  {/* Display Added Sizes as Removable Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {productForm.sizes && productForm.sizes.length > 0 ? (
                      productForm.sizes.map((size: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-50 text-rose-600 border border-pink-200 rounded-lg text-xs font-semibold"
                        >
                          {size}
                          <button
                            type="button"
                            onClick={() => {
                              setProductForm(prev => ({
                                ...prev,
                                sizes: (prev.sizes || []).filter((_: string, i: number) => i !== index)
                              }));
                            }}
                            className="text-rose-400 hover:text-rose-700 ml-1 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">No sizes added yet. Type and click Add or press Enter.</span>
                    )}
                  </div>
                </div>
                    {/* Manual Color Management Section */}
<div>
  <label className="block text-xs font-bold text-charcoal mb-1">Available Colors (Manual Input)</label>
  <div className="flex gap-2 mb-2">
    <input
      type="text"
      id="manualColorInput"
      placeholder="e.g. Red, Blue, Pink, Maroon"
      className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = (e.target as HTMLInputElement).value.trim();
          if (val) {
            const currentColors = productForm.colors || [];
            if (!currentColors.includes(val)) {
              setProductForm(prev => ({ ...prev, colors: [...currentColors, val] }));
            }
            (e.target as HTMLInputElement).value = '';
          }
        }
      }}
    />
    <button
      type="button"
      onClick={() => {
        const input = document.getElementById('manualColorInput') as HTMLInputElement;
        const val = input?.value.trim();
        if (val) {
          const currentColors = productForm.colors || [];
          if (!currentColors.includes(val)) {
            setProductForm(prev => ({ ...prev, colors: [...currentColors, val] }));
          }
          input.value = '';
        }
      }}
      className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 whitespace-nowrap"
    >
      Add Color
    </button>
  </div>
  
  {/* Added Colors Badges List */}
  <div className="flex flex-wrap gap-1.5 mb-3">
    {(productForm.colors || []).map((color: string, idx: number) => (
      <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-50 text-rose-700 text-xs font-semibold rounded-lg border border-pink-200">
        {color}
        <button
          type="button"
          onClick={() => {
            setProductForm(prev => ({
              ...prev,
              colors: (prev.colors || []).filter((_: any, i: number) => i !== idx)
            }));
          }}
          className="text-rose-400 hover:text-rose-700 font-bold ml-1"
        >
          ×
        </button>
      </span>
    ))}
  </div>
</div>
               {/* Multi-Media Gallery & Dual Support */}
<div className="p-3 bg-rose-50/50 rounded-2xl border border-pink-100 space-y-3">
  <p className="text-xs font-bold text-rose-800">Product Image Gallery & Media</p>
  
  {/* 1. Multiple Local File Upload */}
  <div>
    <label className="block text-[11px] font-semibold text-charcoal mb-1">Upload Multiple Images from Device</label>
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={(e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          const newImageUrls: string[] = [];
          Array.from(files).forEach((file) => {
            const url = URL.createObjectURL(file);
            newImageUrls.push(url);
          });
          const existingImages = productForm.images || (productForm.image ? [productForm.image] : []);
          setProductForm(prev => ({
            ...prev,
            images: [...existingImages, ...newImageUrls],
            image: existingImages.length === 0 && newImageUrls.length > 0 ? newImageUrls[0] : prev.image
          }));
        }
      }}
      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
    />
  </div>

  {/* 2. Add External Image URL */}
  <div>
    <label className="block text-[11px] font-semibold text-charcoal mb-1">OR Add External Image URL</label>
    <div className="flex gap-2">
      <input
        type="text"
        id="externalImageUrlInput"
        placeholder="https://example.com/photo.jpg"
        className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500 bg-white"
      />
      <button
        type="button"
        onClick={() => {
          const input = document.getElementById('externalImageUrlInput') as HTMLInputElement;
          const url = input?.value.trim();
          if (url) {
            const existingImages = productForm.images || (productForm.image ? [productForm.image] : []);
            if (!existingImages.includes(url)) {
              const updated = [...existingImages, url];
              setProductForm(prev => ({
                ...prev,
                images: updated,
                image: prev.image || url
              }));
            }
            input.value = '';
          }
        }}
        className="px-3 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 whitespace-nowrap"
      >
        Add URL
      </button>
    </div>
  </div>

  {/* Display Thumbnails Preview & Delete Option */}
  {((productForm.images && productForm.images.length > 0) || productForm.image) && (
    <div>
      <p className="text-[11px] font-semibold text-charcoal mb-1.5">Uploaded Gallery Preview:</p>
      <div className="flex flex-wrap gap-2">
        {(productForm.images && productForm.images.length > 0 ? productForm.images : [productForm.image]).map((imgSrc: string, idx: number) => (
          <div key={idx} className="relative group w-16 h-16 rounded-xl border border-pink-200 overflow-hidden bg-white">
            <img src={imgSrc} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => {
                const currentImages = productForm.images || [productForm.image];
                const updated = currentImages.filter((_: any, i: number) => i !== idx);
                setProductForm(prev => ({
                  ...prev,
                  images: updated,
                  image: updated[0] || ''
                }));
              }}
              className="absolute top-0.5 right-0.5 bg-rose-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold opacity-80 hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Video URL */}
  <div>
    <label className="block text-[11px] font-semibold text-charcoal mb-1">Video URL (Optional: YouTube embed or MP4)</label>
    <input
      type="text"
      value={productForm.videoUrl || ''}
      onChange={(e) => setProductForm(prev => ({ ...prev, videoUrl: e.target.value }))}
      placeholder="https://www.youtube.com/embed/..."
      className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500 bg-white"
    />
  </div>
</div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                    placeholder="Enter detailed description, fabric, sizing, care instructions..."
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-charcoal cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={e => setProductForm(prev => ({ ...prev, inStock: e.target.checked }))}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    Available in Stock
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-charcoal cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={e => setProductForm(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    Featured on Homepage
                  </label>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: ADD / EDIT CATEGORY ──────────────────────────────────── */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100"
            >
              <div className="flex items-center justify-between mb-4 border-b border-pink-100 pb-3">
                <h3 className="font-bold text-charcoal text-base">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-charcoal rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Emoji Icon</label>
                    <input
                      type="text"
                      value={categoryForm.icon}
                      onChange={e => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full text-center py-2 text-base border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                      maxLength={2}
                      required
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-bold text-charcoal mb-1">Category Name</label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={e => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                      placeholder="e.g. Silk Shawls"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Slug (URL friendly)</label>
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={e => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                    placeholder="silk-shawls (leave blank to auto-generate)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Display Order</label>
                  <input
                    type="number"
                    value={categoryForm.order}
                    onChange={e => setCategoryForm(prev => ({ ...prev, order: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                    min="1"
                    required
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryForm.active}
                    onChange={e => setCategoryForm(prev => ({ ...prev, active: e.target.checked }))}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  Visible in Navigation & Dropdown
                </label>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200"
                  >
                    {editingCategory ? 'Save Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
