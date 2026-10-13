'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { useWishlist } from '@/lib/store';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffbf7' }}>
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-pink-100">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="flex items-center gap-3">
            <Heart size={28} className="text-rose-600 fill-rose-600" />
            <h1 className="text-3xl font-bold text-charcoal">My Wishlist</h1>
            {wishlist.length > 0 && (
              <span className="bg-rose-600 text-white text-sm px-3 py-1 rounded-full font-medium">{wishlist.length} items</span>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={80} className="text-rose-100 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-charcoal mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-6">Start adding products you love!</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-full font-medium hover:bg-rose-700 transition-colors">
              <ShoppingBag size={16} /> Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map((item, i) => (
              <ProductCard key={item.productId} product={item.product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
