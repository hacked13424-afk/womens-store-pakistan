'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Bell, Search, Menu, X, ChevronDown, Settings } from 'lucide-react';
import { useCart, useWishlist, useNotifications, useProducts, useCategories, useSiteSettings } from '@/lib/store';
import { Product } from '@/lib/types';

export default function Header() {
  const { itemCount, toggleCart } = useCart();
  const { wishlist } = useWishlist();
  const { notifications, unreadCount, markRead } = useNotifications();
  const { products } = useProducts();
  const { activeCategories: categories } = useCategories();
  const { settings } = useSiteSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length > 1) {
      const results = products.filter(p =>
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase())
      );
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Announcement Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-pink-600 to-rose-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-medium shadow-sm">
        <motion.span
          animate={{ opacity: [1, 0.85, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="inline-block"
        >
          {settings.announcementBanner}
        </motion.span>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 sm:gap-4 justify-between">
            {/* Mobile menu trigger */}
            <button
              className="lg:hidden p-2 text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Brand Logo & Title */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-50 p-1 flex items-center justify-center border border-pink-200 group-hover:border-rose-400 transition-colors">
                <Image src="/images/logo.svg" alt="Women's Store Pakistan" width={44} height={44} className="w-full h-full object-contain" priority />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg font-bold gradient-text leading-tight">Women's Store</h1>
                <p className="text-[10px] text-rose-500 tracking-widest font-bold">PAKISTAN</p>
              </div>
            </Link>

            {/* Real-Time Live Search Bar */}
            <div ref={searchRef} className="flex-1 relative max-w-xl mx-2 sm:mx-6">
              <div className="flex items-center bg-rose-50/70 border border-rose-200 rounded-full px-4 py-2 focus-within:border-rose-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-200 transition-all">
                <Search size={16} className="text-rose-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search makeup, jewelry, unstitched suits, bags..."
                  className="flex-1 ml-2 bg-transparent text-xs sm:text-sm text-charcoal placeholder-rose-300 outline-none"
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setSearchResults([]); setShowSearch(false); }} className="text-rose-400 hover:text-rose-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Auto-Complete Search Dropdown */}
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-pink-100 overflow-hidden z-50 max-h-80 overflow-y-auto"
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map(product => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                          className="flex items-center gap-3 p-3 hover:bg-rose-50 transition-colors border-b border-pink-50 last:border-0"
                        >
                          <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-rose-50 relative">
                            <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-charcoal truncate">{product.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-rose-600 font-bold">Rs. {product.salePrice.toLocaleString()}</span>
                              <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-medium">{product.category}</span>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-xs text-gray-500">No products found matching "{searchQuery}"</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Header Right Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 hover:bg-rose-50 rounded-full transition-colors group"
                title="Wishlist"
              >
                <Heart size={20} className="text-rose-600 group-hover:scale-110 transition-transform" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold pulse-badge shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Real-time Order Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (unreadCount > 0) markRead();
                  }}
                  className="relative p-2 hover:bg-rose-50 rounded-full transition-colors"
                  title="Notifications"
                >
                  <Bell size={20} className="text-rose-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold pulse-badge shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -6 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-pink-100 overflow-hidden z-50"
                    >
                      <div className="p-3 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-pink-100 flex items-center justify-between">
                        <h3 className="font-bold text-charcoal text-xs">Live Order Alerts</h3>
                        <Link href="/admin" onClick={() => setShowNotifications(false)} className="text-[10px] text-rose-600 hover:underline font-semibold">
                          Admin View →
                        </Link>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-pink-50">
                        {notifications.length === 0 ? (
                          <p className="p-6 text-xs text-gray-400 text-center">No alerts right now</p>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className={`p-3 text-xs ${!n.read ? 'bg-rose-50/60' : 'bg-white'}`}>
                              <p className="font-medium text-charcoal leading-snug">{n.message}</p>
                              <p className="text-[10px] text-rose-400 mt-1">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Drawer Trigger */}
              <button
                onClick={toggleCart}
                className="relative p-2 hover:bg-rose-50 rounded-full transition-colors"
                title="Shopping Cart"
              >
                <ShoppingCart size={20} className="text-rose-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold pulse-badge shadow-sm">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Admin Panel Direct Link */}
              <Link
                href="/admin"
                className="p-2 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors"
                title="Super-Admin Panel"
              >
                <Settings size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar (Daraz-like Structure) */}
      <div className="bg-rose-50/80 border-b border-rose-100 hidden lg:block backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 justify-between">
            <div className="flex items-center gap-1">
              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-800 hover:bg-rose-100/70 rounded-xl transition-colors">
                  <Menu size={15} /> All Categories <ChevronDown size={13} />
                </button>
                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full left-0 mt-0 w-60 bg-white rounded-2xl shadow-xl border border-pink-100 z-50 overflow-hidden py-1"
                    >
                      {categories.map(cat => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-charcoal hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        >
                          <span className="text-base">{cat.icon}</span>
                          {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Links */}
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'All Products' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact Us' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-2.5 text-xs font-semibold text-charcoal hover:text-rose-700 hover:bg-rose-100/50 rounded-xl transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Quick Category Pills */}
            <div className="flex items-center gap-1">
              {categories.slice(0, 5).map(cat => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-white rounded-full transition-all border border-transparent hover:border-rose-200"
                >
                  <span>{cat.icon}</span> {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto flex flex-col"
            >
              <div className="p-5 bg-gradient-to-r from-rose-600 to-pink-600 text-white flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-base">Women's Store Pakistan</h2>
                  <p className="text-[11px] text-pink-100">Budget Friendly Luxury</p>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-white p-1">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 space-y-4 flex-1">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2">QUICK LINKS</p>
                  <div className="space-y-1">
                    {[
                      { href: '/', label: '🏠 Home' },
                      { href: '/products', label: '🛍️ All Products' },
                      { href: '/about', label: 'ℹ️ About Us' },
                      { href: '/contact', label: '📞 Contact Us' },
                      { href: '/wishlist', label: '❤️ My Wishlist' },
                    ].map(l => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-xs font-semibold text-charcoal hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-3">
                  <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2">CATEGORIES</p>
                  <div className="space-y-1">
                    {categories.map(cat => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-charcoal hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <span>{cat.icon}</span> {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-3">
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
                  >
                    <Settings size={16} /> Super-Admin Panel
                  </Link>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-green-700 bg-green-100 px-4 py-2 rounded-full w-full justify-center"
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
