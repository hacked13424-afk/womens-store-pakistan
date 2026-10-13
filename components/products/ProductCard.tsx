'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart, useWishlist } from '@/lib/store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);

  const discount = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.title.slice(0, 30)}... added to cart!`, { duration: 2000 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!', { duration: 1500 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-pink-50 transition-shadow duration-300"
    >
      <Link href={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-rose-50">
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer" />
          )}
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                -{discount}%
              </span>
            )}
            {!product.inStock && (
              <span className="bg-gray-600 text-white text-xs px-2 py-0.5 rounded-full">
                Sold Out
              </span>
            )}
            {product.featured && (
              <span className="bg-amber-400 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
                inWishlist ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 hover:bg-rose-50'
              }`}
            >
              <Heart size={14} className={inWishlist ? 'fill-current' : ''} />
            </motion.button>
            <Link href={`/products/${product.id}`}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-white text-rose-600 rounded-full flex items-center justify-center shadow-md hover:bg-rose-50 transition-colors"
              >
                <Eye size={14} />
              </motion.div>
            </Link>
          </div>

          {/* Stock Indicator */}
          {product.inStock && product.stock < 10 && (
            <div className="absolute bottom-0 left-0 right-0 bg-orange-500/90 text-white text-xs text-center py-1 font-medium">
              Only {product.stock} left!
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4">
          <p className="text-xs text-rose-400 font-medium mb-1">{product.category}</p>
          <h3 className="font-semibold text-charcoal text-sm leading-snug line-clamp-2 mb-2 group-hover:text-rose-700 transition-colors">
            {product.title}
          </h3>

          {/* Stars (static for now) */}
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={10} className={s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
            ))}
            <span className="text-xs text-gray-400 ml-1">(12)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-rose-600 text-base">Rs. {product.salePrice.toLocaleString()}</span>
            {product.originalPrice > product.salePrice && (
              <span className="text-xs text-gray-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-2 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              product.inStock
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-transparent'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={12} />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
}
