'use client';
import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  MessageCircle,
  Check,
  Truck,
  Shield,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Send,
  Video,
  CheckCircle,
  Copy
} from 'lucide-react';
import { useProducts, useSiteSettings, useOrders, useCart, useWishlist } from '@/lib/store';
import { Review } from '@/lib/types';
import toast from 'react-hot-toast';
import StarRating from '@/components/ui/StarRating';

const initialSampleReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    customerName: 'Ayesha Raza',
    rating: 5,
    comment: 'SubhanAllah, the texture and color payoff are incredible! Exactly like the photos and got delivered in just 2 days in Lahore. Will order more shades.',
    verified: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    customerName: 'Hira Salman',
    rating: 5,
    comment: 'Very lightweight on the lips, matte but not drying at all. Loved the rose gold packaging. Cash on delivery was seamless.',
    verified: true,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { products } = useProducts();
  const { settings } = useSiteSettings();
  const { createOrder } = useOrders();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = products.find(p => p.id === id);

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(initialSampleReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewForm, setReviewForm] = useState({ name: '', comment: '' });

  // COD Order Form State
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Lahore',
  });

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-charcoal mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you're looking for may have been moved or removed.</p>
        <Link href="/products" className="bg-rose-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-rose-700 transition-colors">
          Browse All Products
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice > product.salePrice
    ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
    : 0;
  const inWishlist = isInWishlist(product.id);
  const images = product.images.length > 0 ? product.images : ['/images/product-lipstick.jpg'];

  // ── WhatsApp Direct Order ────────────────────────────────────────────────
  const handleWhatsAppOrder = () => {
    // Record order in system as WhatsApp order
    createOrder({
      productId: product.id,
      productTitle: product.title,
      productPrice: product.salePrice * quantity,
      customerName: 'WhatsApp Shopper',
      customerPhone: 'Via WhatsApp',
      deliveryAddress: 'Pending in WhatsApp chat',
      city: 'Pakistan',
      orderMethod: 'whatsapp',
      status: 'pending',
      notes: `Qty: ${quantity}`,
    });

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const message = encodeURIComponent(
      `Assalam o Alaikum! I want to order from *Women's Store Pakistan*:\n\n` +
      `🛍️ *Product:* ${product.title}\n` +
      `🔢 *Quantity:* ${quantity}\n` +
      `💰 *Price:* Rs. ${(product.salePrice * quantity).toLocaleString()}\n` +
      `🔗 *Item Link:* ${currentUrl}\n\n` +
      `Please confirm my Cash on Delivery order.`
    );

    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
    toast.success('WhatsApp opened! Order alert sent to store admin.');
  };

  // ── Website COD Order ────────────────────────────────────────────────────
  const handleWebOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.name.trim() || !orderForm.phone.trim() || !orderForm.address.trim()) {
      toast.error('Please complete all delivery details');
      return;
    }

    setOrderSubmitting(true);
    try {
      const generatedOrderId = createOrder({
        productId: product.id,
        productTitle: product.title,
        productPrice: product.salePrice * quantity,
        customerName: orderForm.name,
        customerPhone: orderForm.phone,
        deliveryAddress: orderForm.address,
        city: orderForm.city,
        orderMethod: 'website',
        status: 'pending',
        notes: `Qty: ${quantity}`,
      });

      setOrderSuccessId(generatedOrderId);
      setShowOrderForm(false);
      setOrderForm({ name: '', phone: '', address: '', city: 'Lahore' });
      toast.success(`🎉 Order placed! Order ID: ${generatedOrderId}`, { duration: 5000 });
    } catch (err) {
      toast.error('Failed to submit order');
    } finally {
      setOrderSubmitting(false);
    }
  };

  // ── Review Submit ────────────────────────────────────────────────────────
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      toast.error('Please enter your name and comment');
      return;
    }

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      productId: product.id,
      customerName: reviewForm.name,
      rating: reviewRating,
      comment: reviewForm.comment,
      verified: true,
      createdAt: new Date().toISOString(),
    };

    setReviews(prev => [newRev, ...prev]);
    setShowReviewForm(false);
    setReviewForm({ name: '', comment: '' });
    toast.success('Thank you! Your verified review has been posted.');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffbf7' }}>
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-rose-600 transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-rose-600 transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-charcoal font-semibold truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* ── Left Column: Multi-Image & Video Gallery ─────────────────── */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-rose-50 shadow-lg border border-pink-100">
              {showVideoPlayer && product.videoUrl ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  {product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={product.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={product.videoUrl} controls autoPlay className="w-full h-full object-contain" />
                  )}
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMediaIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={images[currentMediaIndex] || '/images/product-lipstick.jpg'}
                      alt={product.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {discount > 0 && (
                  <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    -{discount}% OFF
                  </span>
                )}
                {product.featured && (
                  <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Featured
                  </span>
                )}
              </div>

              {/* Gallery Arrow Controls */}
              {images.length > 1 && !showVideoPlayer && (
                <>
                  <button
                    onClick={() => setCurrentMediaIndex(prev => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-charcoal rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setCurrentMediaIndex(prev => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-charcoal rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Switcher & Video Selector */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setShowVideoPlayer(false); setCurrentMediaIndex(i); }}
                  className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    !showVideoPlayer && i === currentMediaIndex
                      ? 'border-rose-600 ring-2 ring-rose-200 scale-105'
                      : 'border-pink-100 hover:border-rose-300 opacity-80'
                  }`}
                  style={{ width: '70px', height: '70px' }}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                </button>
              ))}

              {/* Video Thumbnail Button if available */}
              {product.videoUrl && (
                <button
                  onClick={() => setShowVideoPlayer(true)}
                  className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border-2 flex-shrink-0 flex flex-col items-center justify-center bg-gray-900 text-white transition-all ${
                    showVideoPlayer ? 'border-rose-600 ring-2 ring-rose-200' : 'border-gray-800'
                  }`}
                  style={{ width: '70px', height: '70px' }}
                >
                  <Video size={20} className="text-rose-400" />
                  <span className="text-[10px] font-bold mt-1">Video</span>
                </button>
              )}
            </div>
          </div>

          {/* ── Right Column: Product Details & Dual Ordering System ─────── */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-xs text-gray-500 font-medium">SKU: {product.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Rating & Review summary */}
            <div className="flex items-center gap-3">
              <StarRating rating={4.9} size={18} />
              <span className="text-xs font-bold text-charcoal">4.9 / 5.0</span>
              <span className="text-gray-300">|</span>
              <a href="#reviews" className="text-xs text-rose-600 hover:underline font-semibold">
                {reviews.length} Verified Reviews
              </a>
            </div>

            {/* Price section */}
            <div className="p-4 bg-white rounded-2xl border border-pink-100 shadow-sm flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-rose-600">
                Rs. {product.salePrice.toLocaleString()}
              </span>
              {product.originalPrice > product.salePrice && (
                <span className="text-base sm:text-lg text-gray-400 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full ml-auto">
                  Save Rs. {(product.originalPrice - product.salePrice).toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock status indicator */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <Check size={16} className="text-green-600" />
                  <span className="text-xs font-bold text-green-700">In Stock</span>
                  {product.stock <= 10 && (
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      🔥 Only {product.stock} items left in Pakistan!
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm">
              <h3 className="text-xs font-bold text-charcoal tracking-wide uppercase mb-2">Product Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-charcoal">Select Quantity:</span>
              <div className="flex items-center gap-3 bg-white border border-rose-200 rounded-full px-3 py-1 shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-rose-700 hover:bg-rose-50 rounded-full transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-bold text-charcoal w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-7 h-7 flex items-center justify-center text-rose-700 hover:bg-rose-50 rounded-full transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Dual Ordering System (Website COD Form + Quick WhatsApp Order) */}
            <div className="p-5 bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl border border-rose-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-charcoal text-sm">Choose Your Order Method</h3>
                <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                  Cash on Delivery Available
                </span>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Method 1: Direct Website Order (COD Form) */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowOrderForm(true)}
                  disabled={!product.inStock}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 bg-charcoal hover:bg-gray-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all disabled:bg-gray-300"
                >
                  📦 Order on Website (COD)
                </motion.button>

                {/* Method 2: Quick WhatsApp Order Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppOrder}
                  disabled={!product.inStock}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-green-200 transition-all disabled:bg-gray-300"
                >
                  <MessageCircle size={18} /> Quick WhatsApp Order
                </motion.button>
              </div>

              {/* Add to Cart & Wishlist row */}
              <div className="flex gap-2">
                <button
                  onClick={() => { addToCart(product); toast.success('Added to cart!'); }}
                  disabled={!product.inStock}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                >
                  <ShoppingCart size={15} /> Add to Cart
                </button>
                <button
                  onClick={() => { toggleWishlist(product); toast.success(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist!'); }}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    inWishlist
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-rose-600 border-rose-300 hover:bg-rose-50'
                  }`}
                  title="Wishlist"
                >
                  <Heart size={16} className={inWishlist ? 'fill-current' : ''} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 bg-white rounded-2xl border border-pink-100">
                <Truck size={18} className="text-rose-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-xs text-charcoal">Nationwide Delivery</p>
                  <p className="text-[10px] text-gray-500">2-4 business days</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-white rounded-2xl border border-pink-100">
                <Shield size={18} className="text-rose-500 flex-shrink-0" />
                <div>
                  <p className="font-bold text-xs text-charcoal">Quality Checked</p>
                  <p className="text-[10px] text-gray-500">Markaz official verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MODAL: WEBSITE COD ORDER FORM ──────────────────────────────── */}
        <AnimatePresence>
          {showOrderForm && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto"
              >
                <div className="text-center mb-4 border-b border-pink-100 pb-3">
                  <h3 className="font-bold text-charcoal text-lg">Cash on Delivery Order</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Pay in cash when your parcel arrives at your doorstep</p>
                </div>

                {/* Item summary */}
                <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-200 mb-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl relative overflow-hidden bg-white flex-shrink-0">
                    <Image src={images[0]} alt={product.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-charcoal truncate">{product.title}</p>
                    <p className="text-xs text-rose-600 font-bold">
                      Rs. {(product.salePrice * quantity).toLocaleString()} (Qty: {quantity})
                    </p>
                  </div>
                </div>

                <form onSubmit={handleWebOrder} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Your Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Zainab Ahmed"
                      value={orderForm.name}
                      onChange={e => setOrderForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2.5 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Mobile / WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 0300 1234567"
                      value={orderForm.phone}
                      onChange={e => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2.5 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">City</label>
                    <input
                      type="text"
                      placeholder="Lahore, Karachi, Islamabad, Rawalpindi, etc."
                      value={orderForm.city}
                      onChange={e => setOrderForm(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2.5 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Complete Delivery Address</label>
                    <textarea
                      rows={3}
                      placeholder="House / Flat No, Street No, Sector / Area, Landmark"
                      value={orderForm.address}
                      onChange={e => setOrderForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowOrderForm(false)}
                      className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={orderSubmitting}
                      className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 disabled:opacity-50"
                    >
                      {orderSubmitting ? 'Confirming...' : 'Confirm COD Order'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Order Success Confirmation Banner Modal */}
        <AnimatePresence>
          {orderSuccessId && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-pink-100"
              >
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
                  <CheckCircle size={32} />
                </div>
                <h3 className="font-bold text-charcoal text-lg">Order Placed Successfully!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Thank you for shopping with Women's Store Pakistan.
                </p>

                <div className="my-4 p-3 bg-rose-50 rounded-2xl border border-rose-200">
                  <p className="text-[11px] text-gray-500 font-semibold">Your Unique Order ID:</p>
                  <p className="text-base font-extrabold text-rose-700 tracking-wider mt-0.5">{orderSuccessId}</p>
                </div>

                <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
                  Our dispatch team will contact your phone number to verify and dispatch your parcel via Markaz suppliers.
                </p>

                <button
                  onClick={() => setOrderSuccessId(null)}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Continue Shopping
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Product Reviews Section ───────────────────────────────────── */}
        <section id="reviews" className="mt-16 pt-12 border-t border-pink-100">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-charcoal">Customer Reviews & Ratings</h2>
              <p className="text-xs text-gray-500 mt-1">Verified reviews from Pakistani customers</p>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full text-xs font-bold border border-rose-200 transition-colors"
            >
              <Send size={13} /> {showReviewForm ? 'Cancel Review' : 'Leave a Review'}
            </button>
          </div>

          {/* Leave a Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-3xl p-6 border border-pink-200 shadow-sm mb-8 overflow-hidden"
              >
                <h3 className="font-bold text-charcoal text-sm mb-4">Post a Customer Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-charcoal mb-1">Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Fatima Tariq"
                        value={reviewForm.name}
                        onChange={e => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal mb-1">Star Rating</label>
                      <StarRating rating={reviewRating} interactive onRate={setReviewRating} size={22} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Your Review & Feedback</label>
                    <textarea
                      rows={3}
                      placeholder="Share your experience about product quality, packing, or delivery..."
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-pink-100 rounded-xl outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 transition-colors"
                  >
                    Submit Verified Review
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Existing Customer Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(rev => (
              <div key={rev.id} className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-charcoal text-xs">{rev.customerName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <StarRating rating={rev.rating} size={14} />
                      {rev.verified && (
                        <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.2 rounded font-bold">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed pt-1">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
